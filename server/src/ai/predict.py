import argparse
import json
import os
import numpy as np
from PIL import Image

import tensorflow as tf
from tensorflow.keras.models import load_model


def load_model_and_classes(model_path, class_info_path):
    model = load_model(model_path)
    classes = None
    if os.path.exists(class_info_path):
        try:
            with open(class_info_path, 'r') as f:
                class_info = json.load(f)
            classes = class_info.get('classes')
        except Exception:
            classes = None
    if not classes:
        # Fallback class names
        num_classes = model.output_shape[1]
        classes = [f"Class_{i}" for i in range(num_classes)]
    return model, classes


def preprocess_image(image_path):
    image = Image.open(image_path).convert('RGB')
    image = image.resize((224, 224))
    image_array = tf.keras.utils.img_to_array(image)
    try:
        image_array = tf.keras.applications.resnet.preprocess_input(image_array)
    except Exception:
        # If preprocess_input path differs, try generic scaling
        image_array = image_array / 255.0
    image_array = np.expand_dims(image_array, axis=0)
    return image_array


def predict(image_array, model, classes):
    preds = model.predict(image_array, verbose=0)[0]
    top_idx = int(np.argmax(preds))
    confidence = float(preds[top_idx] * 100.0)
    top_3_idx = np.argsort(preds)[::-1][:3]
    top_3 = [
        {"class": classes[i], "confidence": float(preds[i] * 100.0)}
        for i in top_3_idx
    ]
    return classes[top_idx], confidence, top_3


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--image', required=True, help='Path to input image')
    parser.add_argument('--model', required=True, help='Path to .h5 model')
    parser.add_argument('--classes', required=False, default='', help='Path to class info JSON')
    args = parser.parse_args()

    model, classes = load_model_and_classes(args.model, args.classes)
    image_array = preprocess_image(args.image)
    pred_class, confidence, top_3 = predict(image_array, model, classes)

    output = {
        "predictedClass": pred_class,
        "confidence": confidence,
        "top3": top_3
    }
    print(json.dumps(output))


if __name__ == '__main__':
    main()


