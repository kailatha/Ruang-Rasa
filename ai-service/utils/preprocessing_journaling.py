import re

from Sastrawi.StopWordRemover.StopWordRemoverFactory import (
    StopWordRemoverFactory
)

# =====================================================
# SETUP STOPWORDS
# =====================================================

factory_sw = StopWordRemoverFactory()

default_stopwords = factory_sw.get_stop_words()

NEGATION_WORDS = [
    "tidak",
    "bukan",
    "belum",
    "jangan"
]

custom_stopwords = [
    w for w in default_stopwords
    if w not in NEGATION_WORDS
]

# =====================================================
# SLANG MAP
# =====================================================

SLANG_MAP = {
    "gw": "saya",
    "gue": "saya",
    "lu": "kamu",
    "loe": "kamu",
    "yg": "yang",
    "dgn": "dengan",
    "krn": "karena",
    "karna": "karena",
    "tdk": "tidak",
    "ga": "tidak",
    "gak": "tidak",
    "nggak": "tidak",
    "ngga": "tidak",
    "enggak": "tidak",
    "udah": "sudah",
    "udh": "sudah",
    "bgt": "banget",
    "bngt": "banget",
    "kpd": "kepada",
    "utk": "untuk",
    "jd": "jadi",
    "hrs": "harus",
    "blm": "belum",
    "sdh": "sudah",
    "pengen": "ingin",
    "pgn": "ingin",
    "mau": "ingin",
    "mo": "ingin",
    "aja": "saja",
    "aj": "saja",
    "gt": "gitu",
    "tp": "tapi",
    "jg": "juga",
    "sm": "sama",
    "skrg": "sekarang",
    "skr": "sekarang",
    "bs": "bisa",
    "bsa": "bisa",
}

# =====================================================
# CLEANING FUNCTION
# =====================================================

def clean_text(text: str) -> str:

    if not isinstance(text, str):
        return ""

    if text.strip() == "":
        return ""

    # lowercase
    text = text.lower()

    # slang normalization
    words = text.split()

    words = [
        SLANG_MAP.get(w, w)
        for w in words
    ]

    text = " ".join(words)

    # remove symbol
    text = re.sub(r"[^a-z\s]", " ", text)

    # remove extra spaces
    text = re.sub(r"\s+", " ", text).strip()

    # remove stopwords
    words = [
        w for w in text.split()
        if w not in custom_stopwords
    ]

    return " ".join(words)