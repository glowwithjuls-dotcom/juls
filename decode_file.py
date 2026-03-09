from pathlib import Path
import sys

path = Path(sys.argv[1])
text = path.read_text()
path.write_text(bytes(text, 'utf-8').decode('unicode_escape'))
