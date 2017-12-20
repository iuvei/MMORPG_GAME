import sys
import os
import zipfile
import hashlib
import json
import datetime
import shutil

root_path = 'C:\Users\Administrator\Desktop\origin'#sys.argv[1]
cache_dir = "./pkm_cache"

if not os.path.exists(cache_dir):
	os.makedirs(cache_dir)

def CalcMD5(filepath):
    with open(filepath,'rb') as f:
        md5obj = hashlib.md5()
        md5obj.update(f.read())
        hash = md5obj.hexdigest()
        return hash

def process(root,output):
	for parent, subdirs, files in os.walk(root):
    		for name in files:
    			print "file",name
    			if (name.endswith('.png') or name.endswith('.jpg')):
    				output.append(os.path.join(parent,name))


def convert(filepath):
	directory = os.path.dirname(filepath)
	md5 = CalcMD5(filepath)
	cacheFilePath = os.path.join(cache_dir,md5)
	inCache = os.path.exists(cacheFilePath)
	pkmPath = os.path.join(directory,os.path.splitext(os.path.basename(filepath))[0]+".pkm")
	targetPath = os.path.join(directory,os.path.basename(filepath))
	if inCache:
		print "copy cached ",pkmPath
		shutil.copy(cacheFilePath,targetPath)
	else:
		command = 'etcpack ' + path + ' ' + directory + ' -c etc2 -f RGBA8'
		os.system(command)
		shutil.copy(pkmPath,cacheFilePath)
		shutil.move(pkmPath,targetPath)
		print "cache copyed ",targetPath
	# os.remove(path)
files = []
process(root_path,files)
print files
for path in files:
	convert(path)