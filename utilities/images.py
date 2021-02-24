import piexif
from PIL import Image

jpg = "../content/sales/2021/bulls/images/001_IMG_0578.jpg"
new = "../content/sales/2021/bulls/images/001_IMG_0578_new.jpg"
im = Image.open(jpg)
exif_dict = piexif.load(im.info["exif"])
exif_dict["0th"][piexif.ImageIFD.XPTitle] = "THE TITLE".encode("utf-16le")
exif_bytes = piexif.dump(exif_dict)
im.save(new, "jpeg", exif=exif_bytes)