from pathlib import Path
import yaml
import random


# =====================================================
# BASE DIR
# =====================================================

BASE_DIR = Path(__file__).resolve().parent.parent

KNOWLEDGE_DIR = (
    BASE_DIR / "knowledge"
)

# =====================================================
# LOAD FILE
# =====================================================

def load_file(path):

    if path.exists():

        return path.read_text(
            encoding="utf-8"
        )

    return ""

# =====================================================
# PARSE YAML FRONTMATTER
# =====================================================

def parse_markdown(path):

    content = load_file(path)

    if not content.startswith("---"):

        return {}, content

    parts = content.split("---", 2)

    metadata = yaml.safe_load(
        parts[1]
    )

    markdown_body = parts[2]

    return metadata, markdown_body

# =====================================================
# LOAD EMOTION
# =====================================================

def load_emotion(emotion):

    path = (
        KNOWLEDGE_DIR
        / "emotions"
        / f"{emotion.lower()}.md"
    )

    return parse_markdown(path)

# =====================================================
# LOAD INTERVENTION
# =====================================================

def load_intervention(intervention):

    path = (
        KNOWLEDGE_DIR
        / "interventions"
        / f"{intervention}.md"
    )

    return parse_markdown(path)

# =====================================================
# LOAD RESPONSE TEMPLATE
# =====================================================

def load_template(intensity):

    path = (
        KNOWLEDGE_DIR
        / "response-templates"
        / f"{intensity}-distress.md"
    )

    return parse_markdown(path)

# =====================================================
# DETECT INTENSITY
# =====================================================

def detect_intensity(confidence):

    if confidence >= 0.90:
        return "high"

    elif confidence >= 0.70:
        return "moderate"

    return "mild"

# =====================================================
# VALIDATION TEXT
# =====================================================

VALIDATION_MAP = {

    "Sadness": [
        "Aku melihat akhir akhir ini semuanya terasa cukup berat.",
        "Tidak apa apa kalau hari hari terasa melelahkan."
    ],

    "Fear": [
        "Kelihatannya ada banyak kecemasan yang sedang terasa.",
        "Aku bisa memahami kalau situasi ini terasa membuat khawatir."
    ],

    "Anger": [
        "Aku bisa memahami kalau emosimu sedang cukup intens.",
        "Wajar kalau semuanya terasa memicu emosi sekarang."
    ],

    "Joy": [
        "Senang mendengar ada hal baik yang kamu rasakan hari ini.",
        "Aku ikut senang mendengar pengalaman positifmu."
    ],

    "Love": [
        "Perasaan hangat itu terdengar berarti untukmu.",
        "Aku senang kamu bisa merasakan kedekatan emosional itu."
    ],

    "Neutral": [
        "Terima kasih sudah bercerita hari ini."
    ]
}

# =====================================================
# INTERVENTION PRIORITY
# =====================================================

INTERVENTION_PRIORITY = {

    "Sadness": [
        "journaling-reflection",
        "behavioral-activation",
        "grounding"
    ],

    "Fear": [
        "breathing",
        "grounding",
        "mindfulness"
    ],

    "Anger": [
        "grounding",
        "breathing",
        "problem-solving"
    ],

    "Joy": [
        "mindfulness",
        "journaling-reflection"
    ],

    "Love": [
        "social-support",
        "journaling-reflection"
    ],

    "Neutral": [
        "mindfulness"
    ]
}

# =====================================================
# CRISIS KEYWORDS
# =====================================================

CRISIS_KEYWORDS = [

    "bunuh diri",
    "pengen mati",
    "nyakitin diri",
    "self harm",
    "suicide",
    "aku mau hilang",
    "aku pengen hilang",
    "aku ingin mati",
    "hidupku selesai"

]

# =====================================================
# DETECT CRISIS
# =====================================================

def detect_crisis(message):

    message = message.lower()

    for keyword in CRISIS_KEYWORDS:

        if keyword in message:

            return True

    return False

# =====================================================
# GENERATE RESPONSE
# =====================================================

def generate_chat_response(
    message="",
    emotion="Neutral",
    confidence=0.5
):

    # -----------------------------------------
    # Crisis detection
    # -----------------------------------------

    is_crisis = detect_crisis(
        message
    )

    # -----------------------------------------
    # Detect intensity
    # -----------------------------------------

    intensity = detect_intensity(
        confidence
    )

    # -----------------------------------------
    # Force crisis template
    # -----------------------------------------

    if is_crisis:

        intensity = "crisis"

    # -----------------------------------------
    # Load template
    # -----------------------------------------

    template_meta, template_body = (
        load_template(intensity)
    )

    template = template_meta.get(
        "template",
        "{validation}\n\n{intervention}"
    )

    # -----------------------------------------
    # Validation text
    # -----------------------------------------

    validations = VALIDATION_MAP.get(
        emotion,
        ["Terima kasih sudah bercerita."]
    )

    validation = random.choice(
        validations
    )

    # -----------------------------------------
    # Load emotion markdown
    # -----------------------------------------

    emotion_meta, emotion_body = (
        load_emotion(emotion)
    )

    # -----------------------------------------
    # Get interventions
    # -----------------------------------------

    interventions = emotion_meta.get(
        "recommended_interventions",
        []
    )

    # -----------------------------------------
    # Crisis override
    # -----------------------------------------

    if is_crisis:

        interventions = [
            "safety-planning"
        ]

    # -----------------------------------------
    # Intervention selection
    # -----------------------------------------

    priority = INTERVENTION_PRIORITY.get(
        emotion,
        interventions
    )

    selected_intervention = None

    for item in priority:

        if item in interventions:

            selected_intervention = item

            break

    if not selected_intervention:

        if interventions:

            selected_intervention = (
                random.choice(
                    interventions
                )
            )

    # -----------------------------------------
    # Build intervention response
    # -----------------------------------------

    intervention_text = ""

    if selected_intervention:

        intervention_meta, intervention_body = (
            load_intervention(
                selected_intervention
            )
        )

        suggestion = intervention_meta.get(
            "chatbot_suggestion",
            ""
        )

        reflection = intervention_meta.get(
            "reflection_prompt",
            ""
        )

        short_steps = intervention_meta.get(
            "short_steps",
            []
        )

        intervention_text = suggestion

        # -------------------------------------
        # Add steps
        # -------------------------------------

        if short_steps:

            intervention_text += "\n\n"

            intervention_text += (
                "Langkah kecil yang bisa dicoba:\n- "
                + "\n- ".join(short_steps)
            )

        # -------------------------------------
        # Add reflection
        # -------------------------------------

        if reflection:

            intervention_text += (
                f"\n\n{reflection}"
            )

    # -----------------------------------------
    # Build final response
    # -----------------------------------------

    final_response = (
        template.format(
            validation=validation,
            intervention=intervention_text
        )
    )

    # -----------------------------------------
    # Fallback
    # -----------------------------------------

    if not final_response.strip():

        final_response = (
            "Terima kasih sudah bercerita hari ini."
        )

    # -----------------------------------------
    # Return
    # -----------------------------------------

    return {

        "reply": final_response,

        "emotion": emotion,

        "intensity": intensity,

        "intervention": selected_intervention

    }