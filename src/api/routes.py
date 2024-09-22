"""
This module takes care of the API routes
"""
from flask import Blueprint, request, jsonify
from api.models import db, User
from api.utils import APIException
from flask_cors import CORS
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash  # Asegúrate de importar esto

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

@api.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({"msg": "Email y contraseña obligatorios"}), 400
    
    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Usuario ya creado"}), 400

    hashed_password = generate_password_hash(password)  # Usar generate_password_hash aquí

    new_user = User(email=email, password=hashed_password, is_active=True)  # Corregir el nombre de la clase
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "Usuario creado con éxito"}), 201

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"msg": "Email y contraseña obligatorios"}), 400
    
    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password, password):  # Corregir la función de verificación
        access_token = create_access_token(identity=user.id)
        return jsonify({"token": access_token, "msg": "Inicio de sesión con éxito"}), 200
    
    return jsonify({"msg": "Datos incorrectos"}), 401

@api.route('/private', methods=['GET'])
@jwt_required()
def private_route():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404
    
    return jsonify(user.serialize()), 200
