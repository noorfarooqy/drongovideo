#!/usr/bin/python
import sys  
import os  

os.system('convert -define registry:temporary-path=pdfs -density 150 '+sys.argv[1]+' -quality 90 '+sys.argv[2]+' 2>&1')
