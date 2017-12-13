import face_recognition
import sys
import numpy as np

image = face_recognition.load_image_file(sys.argv[1])
face_encoding = face_recognition.face_encodings(image)[0]
test = np.asarray(face_encoding)
#parse the encoding into an array of integers that can be loaded onto the blockchain
num_arr = []
for point in face_encoding:
    num_arr.append(int(float(point) * 1000000000000000))

print(num_arr)
