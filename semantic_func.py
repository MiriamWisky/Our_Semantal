
# # Load a pre-trained word embedding model
# nlp = spacy.load("en_core_web_md")

# def semantic_distance(word1, word2):
#     """
#     Calculate the semantic distance between two words using word embeddings.

#     Args:
#     word1 (str): First word.
#     word2 (str): Second word.

#     Returns:
#     float: Semantic distance between the two words.
#     """
#     # Ensure input words are lowercase
#     word1 = word1.lower()
#     word2 = word2.lower()

#     # Get the word vectors
#     vec1 = nlp(word1).vector
#     vec2 = nlp(word2).vector

#     # Calculate cosine similarity
#     similarity = vec1 @ vec2 / (nlp.vocab.vectors_length * (nlp.vocab.vectors_length - 1))
    
#     # Convert cosine similarity to distance
#     distance = 1.0 - similarity
    
#     return distance

# # Example usage
# word1 = "hello"
# word2 = "hello"
# distance = semantic_distance(word1, word2)
# print(f"Semantic distance between '{word1}' and '{word2}': {distance:.4f}")



import spacy
import numpy as np

# Load a pre-trained word embedding model
nlp = spacy.load("en_core_web_md")

def semantic_similarity(word1, word2):
    """
    Calculate the semantic similarity between two words using word embeddings.

    Args:
    word1 (str): First word.
    word2 (str): Second word.

    Returns:
    float: Semantic similarity between the two words.
    """
    # Ensure input words are lowercase
    word1 = word1.lower()
    word2 = word2.lower()

    # Get the word vectors
    vec1 = nlp(word1).vector
    vec2 = nlp(word2).vector

    # Calculate cosine similarity
    similarity = np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))
    
    # Normalize similarity to range between 0 and 1
    normalized_similarity = 0.5 * (similarity + 1)
    
    if(normalized_similarity < 0.6):
        normalized_similarity -= 0.3
    return  normalized_similarity

# Example usage
word1 = "welcome"
word2 = "hello"
similarity = semantic_similarity(word1, word2)
print(f"Semantic similarity between '{word1}' and '{word2}': {similarity:.4f}")
