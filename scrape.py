from sys import argv, stdout
from pyquery import PyQuery
from requests import get
url = argv[1]
req = get(url)
text = req.text
pobj = PyQuery(text)
code = pobj("#program-source-text")
print(code.html())
