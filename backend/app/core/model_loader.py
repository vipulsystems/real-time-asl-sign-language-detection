import os
import json
import h5py
import tensorflow as tf

MODEL_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "models", "asl_model.h5")
)

print("✅ Attempting to load patched model from:", MODEL_PATH)


def sanitize_config(model_config: dict):
    # ... existing dtype logic ...

    for layer in model_config["config"]["layers"]:
        cfg = layer.get("config", {})
        
        # 1. Handle Input Shapes
        if "batch_shape" in cfg:
            cfg["batch_input_shape"] = cfg.pop("batch_shape")

        # 2. Remove Keras 3 specific parameters that Keras 2 doesn't recognize
        unsupported_keys = ["synchronized", "spatial", "data_format"]
        for key in unsupported_keys:
            if key in cfg:
                cfg.pop(key)

        # 3. Fix nested DType policies
        if isinstance(cfg.get("dtype"), dict):
            cfg["dtype"] = "float32"

    return model_config


def load_patched_model(path):
    with h5py.File(path, "r") as f:
        # Keras 3 often nests the config differently
        config = f.attrs.get("model_config") or f.attrs.get("config")
        
        if config is None:
            raise ValueError(f"Could not find model configuration in {path}. Check H5 attributes.")

        if isinstance(config, bytes):
            config = config.decode("utf-8")

        model_config = json.loads(config)
        
        # Determine if it's a Sequential or Functional model
        # Keras 3 configs are often wrapped in a top-level 'layer' or 'module'
        if "config" not in model_config and "layers" in model_config:
            model_config = {"class_name": "Sequential", "config": model_config}

        model_config = sanitize_config(model_config)

        # Reconstruct the architecture
        model = tf.keras.models.model_from_config(
            model_config,
            custom_objects={
                "DTypePolicy": tf.keras.mixed_precision.Policy
            },
        )

        # Load the raw weights into the reconstructed architecture
        model.load_weights(path)

    return model


model = load_patched_model(MODEL_PATH)


def get_model():
    return model