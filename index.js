import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';

const port = process.env.port || 3000;
const db= process.env.db || 'mongodb://127.0.0.1/rickmorty';
const app = express ();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

 mongoose.connect(db)
    .then(() => console.log("conectado a mongoose"));

    const characterSchema = mongoose.Schema({
        id:{type: Number, unique: true},
        name: String, 
        img: String,
        specie: String,
    });
    const character = mongoose.model('character', characterSchema);

    app.get('api/character', (req,res) =>{
        character.find()
            .then(character => res.status(200).json(character));
    });

    app.get('api/character/search/:name', (req, res) =>{
        character.find({name: {"$segex": req.params.name, "$options": "i"}})
            .then(character => res.status(200).json(character));
    });

    app.get('api/character/:id', (req,res) =>{
        character.findOne({id: req.params.id})
            .then(character => res.status(200).json(character));
    });

    app.get('api/character', (req,res)=>{
        console.log("body:", req.body);
        const {id, name, img, species} = req.body;
        const newCharacter = new character({id, name, img, species});
        newCharacter.save()
        .then(character => res.status(201).json(character));
    });

    


 app.listen(port, ()=>{console.log("server andando");});
