import { useState } from "react";

function Logo() {
  return (
    <div>
      <h1>📦 Penitipan Barang 🏢</h1>
    </div>
  );
}

export default function App() {
  const [items, setItems] = useState([]);

  function handleAddItems(item) {
    const newItem = {
      ...item,
      id: Date.now(),
      inputDate: new Date().toLocaleDateString(), // Tambahkan tanggal penginputan
      status: "Belum Diambil", // Tambahkan status "Belum Diambil"
    };

    setItems((prevItems) => [...prevItems, newItem]);
  }

  function handleDeleteItem(id) {
    setItems((items) => items.filter((item) => item.id !== id));
  }

  function handleUpdateItem(id) {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, packed: !item.packed, status: item.packed ? "Terusan" : "Sudah Diambil" }
          : item
      )
    );
  }

  // ... (fungsi-fungsi lainnya tetap sama)

  return (
    <div className="app consignment-theme">
      <Logo />
      <Form onAddItems={handleAddItems} />
      <ConsignmentList 
        items={items} 
        onDeleteItem={handleDeleteItem}
        onUpdateItem={handleUpdateItem}
      />
      <ConsignmentStats items={items} />
    </div>
  );
}

function Form({ onAddItems }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState("Miscellaneous");
  const [reminderDate, setReminderDate] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!description) return;

    const newItem = { description, quantity, packed: false, id: Date.now(), category, reminderDate };
    console.log(newItem);

    onAddItems(newItem);

    setDescription("");
    setQuantity(1);
    setCategory("Miscellaneous");
    setReminderDate("12-12-2015");
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>Tambah Barang📦</h3>
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option key={num} value={num}>
            {num}
          </option>
        ))}
      </select>
      <input 
        type="text" 
        placeholder="Barang yang dititip" 
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="Miscellaneous">Miscellaneous</option>
        <option value="Clothing">Clothing</option>
         <option value="Electronics">Electronics</option>
      </select>
      <input 
        type="datetime-local" 
        placeholder="Tanggal Pengambilan" 
        value={reminderDate}
        onChange={(e) => setReminderDate(e.target.value)}
      />
      <button>Titip</button>
    </form>
  );
}

function ConsignmentList({ items, onDeleteItem, onUpdateItem }) {
  return (
    <div className="consignment-list">
      <ul>
        {items.map((item) => (
          <ConsignmentItem 
            item={item} 
            key={item.id} 
            onDeleteItem={onDeleteItem}   
            onUpdateItem={onUpdateItem}
          />
        ))}
      </ul>
    </div>
  );
}

function ConsignmentItem({ item, onDeleteItem, onUpdateItem }) {
  function handleDelete() {
    onDeleteItem(item.id);
  }

  return (
    <div className="consignment-item">
    <li>
      <input
        type="checkbox"
        value={item.packed}
        onChange={() => onUpdateItem(item.id)}
      />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description} - {item.inputDate}
      </span>
      <span>({item.status})</span>
      <button onClick={handleDelete}>Hapus</button>
      {!item.packed && (
        <button onClick={() => onUpdateItem(item.id)}>Ambil</button>
      )}
    </li>
    </div>
  );
}

function ConsignmentStats({ items }) {
  if (!items.length)
    return (
      <p className="consignment-stats">
        <em>Mulai Tambahkan Barang Penitipan Anda 📦</em>
      </p>
    );

  const numItems = items.length;
  const numPacked = items.filter((item) => item.packed).length;
  const percentage = Math.round((numPacked / numItems) * 100);

  return (
    <footer className="consignment-stats">
      <em>
        {percentage === 100
          ? "Semua Barang Sudah Diambil! 🚚"
          : `📦 Anda punya ${numItems} barang di daftar, dan ${numPacked}
         barang sudah diambil (${percentage}%)`}
      </em>
    </footer>
  );
}