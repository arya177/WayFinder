import numpy as np
from PIL import Image
from feature_extractor import FeatureExtractor
from datetime import datetime
from flask import Flask, request, render_template, jsonify
from pathlib import Path
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 

# Read image features
fe = FeatureExtractor()
features = []
img_paths = []
for feature_path in Path("./static/feature").glob("*.npy"):
    features.append(np.load(feature_path))
    img_paths.append(Path("./static/img") / (feature_path.stem + ".jpg"))
features = np.array(features)

@app.route('/upload', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        file = request.files['query_img']

        # Save query image
        img = Image.open(file.stream)  # PIL image
        uploaded_img_path = "static/uploaded/" + datetime.now().isoformat().replace(":", ".") + "_" + file.filename
        img.save(uploaded_img_path)

        # Run search
        query = fe.extract(img)
        dists = np.linalg.norm(features - query, axis=1)  # L2 distances to features

        # Convert distances to similarity scores
        similarity_scores = 1 / (1 + dists)

        # Normalize scores to percentages
        normalized_scores = (similarity_scores / np.max(similarity_scores)) * 100

        # Get top 30 results
        ids = np.argsort(normalized_scores)[::-1][:30]
        scores = [{"similarity": float(normalized_scores[id]), "imageUrl": str(img_paths[id])} for id in ids]

        return jsonify(scores)

if __name__=="__main__":
    app.run("0.0.0.0", "5001")
