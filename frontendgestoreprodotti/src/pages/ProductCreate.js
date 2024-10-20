import React, { useState, useEffect } from 'react';
import { createProduct, fetchCategories } from '../api'; // Assicurati che questa importazione sia corretta
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Assicurati di importare Bootstrap
import './ProductCreate.css'; // Collega il file CSS personalizzato

const ProductCreate = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]); // Modificato per essere un array
    const [category, setCategory] = useState('');
    const [subcategory, setSubcategory] = useState(''); // Stato per la sottocategoria
    const [categories, setCategories] = useState([]); // Stato per le categorie
    const [subcategories, setSubcategories] = useState([]); // Stato per le sottocategorie
    const navigate = useNavigate();

    // Funzione per recuperare le categorie all'avvio del componente
    useEffect(() => {
        const getCategories = async () => {
            try {
                const data = await fetchCategories(); // Utilizza la funzione importata
                setCategories(data); // Imposta le categorie recuperate nello stato
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        getCategories();
    }, []);

    // Funzione per aggiornare le sottocategorie quando cambia la categoria
    useEffect(() => {
        const selectedCategory = categories.find(cat => cat._id === category);
        setSubcategories(selectedCategory ? selectedCategory.subcategories : []);
        setSubcategory(''); // Resetta la sottocategoria quando cambia la categoria
    }, [category, categories]);

    const handleImageChange = (e) => {
        setImages(Array.from(e.target.files)); // Aggiorna lo stato con l'array di file
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Crea un oggetto prodotto da inviare
        const product = { 
            name, 
            description, 
            category, 
            subcategory: {
                id: subcategory,
                name: subcategories.find(sub => sub._id === subcategory)?.name // Trova il nome della sottocategoria
            }, 
            images 
        };
    
        console.log('Product to be created:', product); // Debug: visualizza l'oggetto prodotto
    
        try {
            await createProduct(product, images); // Invia anche le immagini
            alert('Prodotto creato con successo!'); // Popup di successo
            navigate('/products'); // Reindirizza alla pagina dei prodotti
        } catch (error) {
            console.error('Error creating product:', error);
            alert('Errore durante la creazione del prodotto: ' + error.message); // Popup di errore
        }
    };
    
    

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Crea Nuovo Prodotto</h2>
            <form onSubmit={handleSubmit} className="bg-light p-3 rounded custom-card"> {/* Aggiungi classe personalizzata */}
                <div className="mb-3">
                    <label className="form-label">Nome:</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Descrizione:</label>
                    <textarea 
                        className="form-control" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Immagini:</label>
                    <input 
                        type="file" 
                        className="form-control" 
                        multiple 
                        onChange={handleImageChange} 
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Seleziona Categoria:</label>
                    <select 
                        className="form-select" 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)} 
                        required
                    >
                        <option value="">Seleziona una categoria</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name} {/* Assicurati che il campo corretto venga utilizzato */}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Seleziona Sottocategoria:</label>
                    <select 
                        className="form-select" 
                        value={subcategory} 
                        onChange={(e) => setSubcategory(e.target.value)} 
                        required
                    >
                        <option value="">Seleziona una sottocategoria</option>
                        {subcategories.map((sub) => (
                            <option key={sub._id} value={sub._id}>
                                {sub.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary w-100">Crea Prodotto</button>
            </form>
        </div>
    );
};

export default ProductCreate;
