from flask import Flask, request, Response
from werkzeug.utils import secure_filename
from werkzeug.middleware.shared_data import SharedDataMiddleware
import os
import json

UPLOAD_FOLDER = "/data/images"
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.add_url_rule('/images/<filename>', 'uploaded_file',
                 build_only=True)
app.wsgi_app = SharedDataMiddleware(app.wsgi_app, {
    '/images':  app.config['UPLOAD_FOLDER']
})


def success_response(**kwargs):
    kwargs["response_code"] = 200
    data = json.dumps(kwargs)
    return Response(data, kwargs["response_code"], mimetype='application/json')

# return a json error response
def error_response(**kwargs):
    kwargs["response_code"] = 500
    data = json.dumps(kwargs)
    return Response(data, kwargs["response_code"], mimetype='application/json')


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/saveImage', methods=['POST'])
def save_image():
    if 'data' not in request.files:
        return error_response(message="No file in request")
    file = request.files['data']
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return success_response(message="File Upload Successful")
    else:
        return error_response(message="Invalid File Type")


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
