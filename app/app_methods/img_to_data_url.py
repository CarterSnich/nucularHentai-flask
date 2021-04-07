from io import BytesIO
import base64


def img_to_data_url(im):
    try:
        output = BytesIO()
        im.save(output, format='JPEG')
        im_data = output.getvalue()

        image_data = base64.b64encode(im_data)
        if not type(image_data) == str:
            # Python 3, decode from bytes to string
            image_data = image_data.decode()
        _data = f"data:image/jpg;base64,{image_data}"
        return _data
    except:
        return None