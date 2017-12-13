import face_recognition
import sys
import numpy as np

def makeNDArray(arr):
    i=0
    result = []
    while (i < len(arr)):
        result.append(int(arr[i]) * .000000000000001)
        i=i+1
    return np.asarray(result)

encodingOne = makeNDArray(sys.argv[1].split(','))
encodingTwo = makeNDArray(sys.argv[2].split(','))
results = face_recognition.compare_faces([encodingOne], encodingTwo)
print(results[0])