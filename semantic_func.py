
# import spacy
# import numpy as np

# # Load a pre-trained word embedding model
# # nlp = spacy.load("en_core_web_md")
# nlp = spacy.load("en_core_web_md")


# def semantic_similarity(word1, word2):
#     """
#     Calculate the semantic similarity between two words using word embeddings.

#     Args:
#     word1 (str): First word.
#     word2 (str): Second word.

#     Returns:
#     float: Semantic similarity between the two words.
#     """
#     # Ensure input words are lowercase
#     word1 = word1.lower()
#     word2 = word2.lower()
#     if(word1 == word2):
#         return 1

#     # Get the word vectors
#     vec1 = nlp(word1).vector
#     vec2 = nlp(word2).vector

#     # Calculate cosine similarity
#     similarity = np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))
    
#     # Normalize similarity to range between 0 and 1
#     normalized_similarity = 0.5 * (similarity + 1)
    
#     if(normalized_similarity < 0.6):
#         normalized_similarity -= 0.3
#     return  normalized_similarity


from flask import Flask, request, jsonify
import spacy
import numpy as np

app = Flask(__name__)

# Load a pre-trained word embedding model
nlp = spacy.load("en_core_web_md")

@app.route('/calculate-semantic-similarity', methods=['POST'])
def calculate_semantic_similarity():
    data = request.get_json()
    word1 = data.get('word1', '')
    word2 = data.get('word2', '')

    # Ensure input words are lowercase
    word1 = word1.lower()
    word2 = word2.lower()
    if word1 == word2:
        return jsonify({'similarity': 1})

    # Get the word vectors
    vec1 = nlp(word1).vector
    vec2 = nlp(word2).vector

    # Calculate cosine similarity
    similarity = np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))

    # Normalize similarity to range between 0 and 1
    normalized_similarity = 0.5 * (similarity + 1)

    if normalized_similarity < 0.6:
        normalized_similarity -= 0.3

    return jsonify({'similarity': normalized_similarity})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
