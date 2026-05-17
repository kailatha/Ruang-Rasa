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


CUSTOM_OBJECTS = {
    "FeatureAttention": FeatureAttention,
    "RuangRasa>FeatureAttention": FeatureAttention,
}