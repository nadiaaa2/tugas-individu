"use client";

import { useState } from "react";
import styles from './page.module.css';

export default function CustomerManagement() {
  // 1. State untuk menyimpan daftar customer
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");
  const [purchaseDateTime, setPurchaseDateTime] = useState(""); 
  const [paymentMethod, setPaymentMethod] = useState("");
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("name");

  // State untuk menyimpan produk yang dipesan dan total harga
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [productQuantity, setProductQuantity] = useState(0);
  const [productPrice, setProductPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0); // Menyimpan total harga

  // 2. Fungsi untuk menambah produk ke daftar produk sementara
  const addProduct = () => {
    if (productName === "" || productQuantity <= 0 || productPrice <= 0) {
      alert("Nama produk, jumlah, dan harga tidak boleh kosong.");
      return;
    }

    const newProduct = {
      id: products.length + 1,
      name: productName,
      quantity: productQuantity,
      price: productPrice,
      total: productQuantity * productPrice // Hitung total per produk
    };

    setProducts([...products, newProduct]);
    setProductName("");
    setProductQuantity(0);
    setProductPrice(0);
    
    // Perbarui total harga setelah produk ditambahkan
    setTotalPrice(prevTotal => prevTotal + newProduct.total);
  };

  // 3. Fungsi untuk menghapus produk dari daftar produk sementara
  const deleteProduct = (id) => {
    const productToDelete = products.find(product => product.id === id);
    const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(updatedProducts);
    
    // Kurangi total harga dengan harga produk yang dihapus
    setTotalPrice(prevTotal => prevTotal - productToDelete.total);
  };

  // 4. Fungsi untuk menambah customer
  const addCustomer = () => {
    if (name === "" || products.length === 0 || purchaseDateTime === "") {
      alert("Nama customer, produk, dan waktu pembelian tidak boleh kosong.");
      return;
    }

    const newCustomer = {
      id: customers.length + 1,
      name: name.toLowerCase(),
      purchaseDateTime,
      paymentMethod,
      products,
      totalPrice // Simpan total harga pesanan customer
    };

    setCustomers([...customers, newCustomer]);
    setName("");
    setPurchaseDateTime(""); 
    setPaymentMethod("");
    setProducts([]); // Reset daftar produk setelah ditambahkan
    setTotalPrice(0); // Reset total harga setelah customer ditambahkan
  };

  // 5. Fungsi untuk menghapus customer
  const deleteCustomer = (id) => {
    const updatedCustomers = customers.filter((customer) => customer.id !== id);
    setCustomers(updatedCustomers);
  };

  // 6. Fungsi untuk mencari customer berdasarkan nama atau produk
  const searchCustomers = () => {
    return customers.filter((customer) =>
      customer.name.includes(searchTerm.toLowerCase()) ||
      customer.products.some((product) =>
        product.name.includes(searchTerm.toLowerCase())
      )
    );
  };

  // 7. Fungsi untuk mengurutkan customer berdasarkan opsi (nama atau jumlah produk)
  const sortCustomers = () => {
    const sortedCustomers = [...searchCustomers()].sort((a, b) => {
      if (sortOption === "name") {
        return a.name.localeCompare(b.name);
      } else {
        const totalA = a.products.reduce((total, product) => total + product.quantity, 0);
        const totalB = b.products.reduce((total, product) => total + product.quantity, 0);
        return totalA - totalB;
      }
    });
    return sortedCustomers;
  };

  // 8. Fungsi untuk mengedit customer
const editCustomer = (customer) => {
  setEditingCustomerId(customer.id);
  setName(customer.name);
  setPurchaseDateTime(customer.purchaseDateTime);
  setPaymentMethod(customer.paymentMethod);
  setProducts(customer.products);
  setTotalPrice(customer.totalPrice); // Set total harga sesuai produk yang sedang diedit
};

// 9. Fungsi untuk memperbarui customer
const updateCustomer = () => {
  if (name === "" || products.length === 0 || purchaseDateTime === "") {
    alert("Nama customer, produk, dan waktu pembelian tidak boleh kosong.");
    return;
  }

  const updatedCustomers = customers.map((customer) =>
    customer.id === editingCustomerId
      ? {
          ...customer,
          name: name.toLowerCase(),
          purchaseDateTime,
          paymentMethod,
          products,
          totalPrice, // Perbarui total harga
        }
      : customer
  );

  setCustomers(updatedCustomers);
  setEditingCustomerId(null);
  setName("");
  setPurchaseDateTime("");
  setPaymentMethod("");
  setProducts([]);
  setTotalPrice(0);
};


  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Customer Management System</h1>

      {/* Form untuk menambah atau mengedit customer */}
      <div className={styles.formGroup}>
        <input
          className={styles.tmproduk}
          type="text"
          placeholder="Nama Customer"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className={styles.tmproduk}
          type="datetime-local"
          value={purchaseDateTime}
          onChange={(e) => setPurchaseDateTime(e.target.value)}
        />
        <select
          className={styles.tmproduk}
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="">Pilih Metode Pembayaran</option>
          <option value="credit">Kartu Kredit</option>
          <option value="debit">Kartu Debit</option>
          <option value="cash">Tunai</option>
        </select>
        
        {/* Form untuk menambah produk */}
        <div className={styles.produk}>
          <label>Nama Produk</label>
          <input
            className={styles.tabel}
            type="text"
            placeholder="Nama Produk"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          </div>
          <div className={styles.produk}>
            <label>jumlah produk </label>
            <input
            className={styles.tabel}
            type="number"
            placeholder="Jumlah Produk"
            value={productQuantity}
            onChange={(e) => setProductQuantity(Number(e.target.value))}
          />
          </div>
         <div className={styles.produk}>
          <label>Harga Produk</label>
          <input
            className={styles.tabel}
            type="number"
            placeholder="Harga Produk"
            value={productPrice}
            onChange={(e) => setProductPrice(Number(e.target.value))}/>
          </div>

          <div>
          <button className={styles.tambahproduk} onClick={addProduct}>Tambah Produk</button>
        </div>

        {/* Daftar produk sementara */}
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product.name} - Jumlah: {product.quantity} - Harga: {product.price} - Total: {product.total}
              <button className={styles.tambahproduk} onClick={() => deleteProduct(product.id)}>Hapus</button>
            </li>
          ))}
        </ul>

        {/* Total Harga */}
        <div>
          <strong>Total Harga: {totalPrice}</strong>
        </div>

       
        {editingCustomerId === null ? (
          <button className={styles.strong} onClick={addCustomer}>Tambah Customer</button>
        ) : (
           <button className={styles.strong} onClick={updateCustomer}>Perbarui Customer</button>
        )}
      </div>

      {/* Input untuk mencari customer */}
      <div>
        <input 
          className={styles.carinm}
          type="text"
          placeholder="Cari Nama atau Produk"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Opsi untuk mengurutkan customer */}
      <div>
        <select className={styles.carinm} onChange={(e) => setSortOption(e.target.value)}>
          <option value="name">Urutkan berdasarkan Nama</option>
          <option value="productQuantity">Urutkan berdasarkan Jumlah Produk</option>
        </select>
      </div>

      {/* Daftar customer */}
      <ul>
        {sortCustomers().map((customer) => (
          <li key={customer.id}>
            {customer.name} - Waktu: {new Date(customer.purchaseDateTime).toLocaleString()} - Metode Pembayaran: {customer.paymentMethod}
            <ul>
              {customer.products.map((product) => (
                <li key={product.id}>
                 Produk : {product.name} <br />
                 Jumlah: {product.quantity} <br />
                 Harga: {product.price} <br />
                </li>
              ))}
            </ul>
            <strong>Total Harga: {customer.totalPrice}</strong>
            <button className={styles.tambahproduk} onClick={() => deleteCustomer(customer.id)}>Hapus Customer</button>
            <button className={styles.tambahproduk} onClick={() => editCustomer(customer)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

