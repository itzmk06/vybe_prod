import gzip
import pickle
import os

with open('movie_list.pkl', 'rb') as f_in:
    with gzip.open('movie_list.pkl.gz', 'wb') as f_out:
        f_out.write(f_in.read())

with open('similarity.pkl', 'rb') as f_in:
    with gzip.open('similarity.pkl.gz', 'wb') as f_out:
        f_out.write(f_in.read())

for f in ['movie_list.pkl.gz', 'similarity.pkl.gz']:
    size = os.path.getsize(f) / (1024*1024)
    print(f"{f}: {size:.2f} MB")