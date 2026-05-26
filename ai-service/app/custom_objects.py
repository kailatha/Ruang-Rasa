import tensorflow as tf
from tensorflow.keras import layers

@tf.keras.utils.register_keras_serializable(package="RuangRasa")
class FeatureAttention(layers.Layer):
    def __init__(self, units=16, **kwargs):
        super().__init__(**kwargs)
        self.units = units
        self.dense = layers.Dense(units, activation="tanh")
        self.score = layers.Dense(1)

    def call(self, inputs):
        x = tf.expand_dims(inputs, axis=-1)
        attention_hidden = self.dense(x)
        attention_score = self.score(attention_hidden)
        attention_weights = tf.nn.softmax(attention_score, axis=1)
        attention_weights = tf.squeeze(attention_weights, axis=-1)
        return inputs * attention_weights

    def get_config(self):
        config = super().get_config()
        config.update({"units": self.units})
        return config

# Custome Object untuk jurnaling 
@tf.keras.utils.register_keras_serializable(package="RuangRasa")
class TemporalContextAttention(layers.Layer):

    def __init__(self, units=64, **kwargs):
        super().__init__(**kwargs)

        self.units = units

        self.W_text = layers.Dense(units)

        self.W_ctx = layers.Dense(units)

        self.V = layers.Dense(1)

    def call(self, text_repr, context_repr):

        text_proj = self.W_text(text_repr)

        ctx_proj = self.W_ctx(context_repr)

        combined = tf.nn.tanh(
            text_proj + ctx_proj
        )

        score = self.V(combined)

        gate = tf.nn.sigmoid(score)

        text_out = self.W_text(text_repr)

        ctx_out = self.W_ctx(context_repr)

        return (
            gate * text_out +
            (1 - gate) * ctx_out
        )

    def get_config(self):

        config = super().get_config()

        config.update({
            "units": self.units
        })

        return config
        
CUSTOM_OBJECTS = {
    "FeatureAttention": FeatureAttention,
    "RuangRasa>FeatureAttention": FeatureAttention,
}