import tensorflow as tf
import os
import json

print(f"TensorFlow Version: {tf.__version__}")

# Configuration
data_dir = "D:/collage study/crop doctor/dataset"
BATCH_SIZE = 16
IMG_SIZE = (224, 224)
EPOCHS = 5 # Set to a low number for faster training, increase to 15-20 for max accuracy.
MODEL_SAVE_PATH = "crop_doctor_model.keras"

print("\n🌿 [1/4] Loading Local Dataset...")

train_ds = tf.keras.preprocessing.image_dataset_from_directory(
    data_dir,
    validation_split=0.2,
    subset="training",
    seed=123,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE
)

val_ds = tf.keras.preprocessing.image_dataset_from_directory(
    data_dir,
    validation_split=0.2,
    subset="validation",
    seed=123,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE
)

class_names = train_ds.class_names
NUM_CLASSES = len(class_names)

print(f"✅ Dataset Loaded! Found {NUM_CLASSES} different crop/disease classes.")
print(f"Classes: {class_names}")

# Normalize pixel values to [0, 1]
normalization_layer = tf.keras.layers.Rescaling(1./255)
train_ds = train_ds.map(lambda x, y: (normalization_layer(x), y), num_parallel_calls=tf.data.AUTOTUNE)
val_ds = val_ds.map(lambda x, y: (normalization_layer(x), y), num_parallel_calls=tf.data.AUTOTUNE)

# Do not use .cache() because 54,000 uncompressed float32 images requires ~32GB of RAM and causes a crash!
train_ds = train_ds.prefetch(buffer_size=tf.data.AUTOTUNE)
val_ds = val_ds.prefetch(buffer_size=tf.data.AUTOTUNE)

# Build a CNN Model using Transfer Learning (MobileNetV2) for fast & highly accurate learning
print("\n🧠 [3/4] Building Artificial Neural Network (MobileNetV2)...")
base_model = tf.keras.applications.MobileNetV2(
    input_shape=(224, 224, 3),
    include_top=False,
    weights='imagenet' # Pre-trained starting point for faster convergence
)

# Freeze the base model so we only train the new decision layers
base_model.trainable = False

model = tf.keras.Sequential([
    base_model,
    tf.keras.layers.GlobalAveragePooling2D(),
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dropout(0.2), # Prevent overfitting
    tf.keras.layers.Dense(NUM_CLASSES, activation='softmax') # Final prediction layer
])

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

model.summary()

# Train the custom model
print(f"\n🚀 [4/4] Actively Training the AI Model for {EPOCHS} epochs...")
print("This will take a few minutes depending on your computer's CPU/GPU speed.")

history = model.fit(
    train_ds,
    epochs=EPOCHS,
    validation_data=val_ds
)

# Save the trained AI model locally
print(f"\n💾 Training Complete! Saving model to '{MODEL_SAVE_PATH}'...")
model.save(MODEL_SAVE_PATH)

print("\n💾 Saving class names...")
with open("class_names.json", "w") as f:
    json.dump(class_names, f)

print("🎉 Model successfully exported! You can now run the FastAPI server to use it.")
