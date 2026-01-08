import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { DatePicker, Input, Table, Button, Modal, Form, Card } from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

/* ================= PAGE 1 ================= */
function Page1() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const startDate = dayjs().subtract(7, "day");
  const endDate = dayjs();

  useEffect(() => {
    fetch(`https://dummyjson.com/products/search?q=${search}`)
      .then(res => res.json())
      .then(data => setProducts(data.products || []));
  }, [search]);

  const columns = [
    { title: "Title", dataIndex: "title" },
    { title: "Price", dataIndex: "price" },
    { title: "Brand", dataIndex: "brand" }
  ];

  const handleAddProduct = values => {
    setOpen(false);
    navigate("/confirm", { state: values });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Product Management</h2>

      <RangePicker
        defaultValue={[startDate, endDate]}
        disabledDate={current => current && current > dayjs()}
        style={{ marginBottom: 10 }}
      />

      <br />

      <Input.Search
        placeholder="Search products"
        onSearch={value => setSearch(value)}
        style={{ width: 300, margin: "10px 0" }}
      />

      <br />

      <Button type="primary" onClick={() => setOpen(true)}>
        Add Product
      </Button>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={products}
        style={{ marginTop: 20 }}
      />

      <Modal
        title="Add Product"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleAddProduct}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="brand" label="Brand" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

/* ================= PAGE 2 ================= */
function Page2() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const handleConfirm = () => {
    fetch("https://dummyjson.com/products/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state)
    })
      .then(res => res.json())
      .then(() => {
        alert("Product created successfully");
        navigate("/");
      });
  };

  return (
    <div style={{ padding: 20 }}>
      <Card title="Confirm Product Details" style={{ width: 400 }}>
        <p><b>Title:</b> {state?.title}</p>
        <p><b>Price:</b> {state?.price}</p>
        <p><b>Brand:</b> {state?.brand}</p>

        <Button type="primary" onClick={handleConfirm}>
          Confirm & Submit
        </Button>
      </Card>
    </div>
  );
}

/* ================= MAIN APP ================= */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Page1 />} />
      <Route path="/confirm" element={<Page2 />} />
    </Routes>
  );
}
