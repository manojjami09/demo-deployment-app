import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseconfig";

const AddProduct = () => {
  const addProduct = async () => {
    try {
      const docRef = await addDoc(collection(db, "products"), {
        name: "iPhone 15 Pro",
        price: 1299,
        category: "electronics",
        stock: 10,
      });
      console.log("Product added with ID:", docRef.id);
    } catch (e) {
      console.error("Error adding product:", e);
    }
  };

  return (
    <button onClick={addProduct} style={{ padding: "10px", fontSize: "16px" }}>
      Add Product
    </button>
  );
};

export default AddProduct;
