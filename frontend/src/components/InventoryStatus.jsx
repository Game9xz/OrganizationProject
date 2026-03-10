import { useState } from "react";
import "./InventoryStatus.css";
import Sidebar from "./Sidebar";

export default function InventoryStatus() {

  const [inventory, setInventory] = useState([
    {
      id: 1,
      status: "ยืมแล้ว",
      borrowDate: "1/1/2026",
      returnDate: "3/1/2026",
      job: "งานแต่ง 2",
      manager: "นางสาวกาญจนศิริ แซ่ตุ้ย",
      phone: "087-395-6554",
    },
  ]);

  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    job: "",
    borrowDate: "",
    returnDate: "",
    manager: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAdd = () => {
    const newItem = {
      id: inventory.length + 1,
      status: "ยืมแล้ว",
      ...formData,
    };

    setInventory([...inventory, newItem]);

    setFormData({
      job: "",
      borrowDate: "",
      returnDate: "",
      manager: "",
      phone: "",
    });

    setShowModal(false);
  };

  const handleReturn = (id) => {
    const updated = inventory.map((item) =>
      item.id === id ? { ...item, status: "คืนแล้ว" } : item
    );
    setInventory(updated);
  };

  const handleRemove = (id) => {
    const updated = inventory.filter((item) => item.id !== id);
    setInventory(updated);
  };

  const checkDueStatus = (returnDate, status) => {
    const today = new Date();
    const due = new Date(returnDate);

    if (status === "คืนแล้ว") {
      if (today > due) {
        return "late";
      }
      return "done";
    }

    if (today > due) {
      return "late";
    }

    return "normal";
  };

  return (
    <div className="inv-layout">

      <Sidebar />

      <main className="inv-content">

        <table className="warehouse-table">

          <thead>
            <tr>
              <th>#</th>
              <th>สถานะ</th>
              <th>วันที่ยืม</th>
              <th>กำหนดคืน</th>
              <th>ชื่องาน</th>
              <th>ชื่อผู้ดูแล</th>
              <th>เบอร์โทร</th>
              <th>Action</th>
              <th>ครบกำหนด</th>
            </tr>
          </thead>

          <tbody>

            {inventory.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>

                <td>
                  <span
                    className={
                      item.status === "คืนแล้ว"
                        ? "status returned"
                        : "status borrowed"
                    }
                  >
                    {item.status}
                  </span>
                </td>

                <td>{item.borrowDate}</td>
                <td>{item.returnDate}</td>
                <td>{item.job}</td>
                <td>{item.manager}</td>
                <td>{item.phone}</td>

                <td className="actions">
                  {item.status === "ยืมแล้ว" ? (
                    <>
                      <button
                        className="btn-return"
                        onClick={() => handleReturn(item.id)}
                      >
                        คืน
                      </button>

                      <button
                        className="btn-cancel"
                        onClick={() => handleRemove(item.id)}
                      >
                        ลบ
                      </button>
                    </>
                  ) : (
                    <span className="done">✓</span>
                  )}
                </td>

                <td>
                  {checkDueStatus(item.returnDate, item.status) === "late" ? (
                    <span className="late">เลยกำหนด</span>
                  ) : item.status === "คืนแล้ว" ? (
                    <span className="done">✓</span>
                  ) : (
                    "-"
                  )}
                </td>

              </tr>
            ))}

            {[...Array(10 - inventory.length)].map((_, i) => (
              <tr key={"empty" + i}>
                <td>{inventory.length + i + 1}</td>

                <td>
                  <span className="status empty">ว่าง</span>
                </td>

                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>

                <td>
                  <button className="btn-borrow">
                    ↩ ยืม
                  </button>
                </td>

                <td>-</td>
              </tr>
            ))}

          </tbody>

        </table>

        <button
          className="add-btn"
          onClick={() => setShowModal(true)}
        >
          + เพิ่ม
        </button>

      </main>

      {showModal && (

        <div className="modal">

          <div className="modal-box">

            <h2>เพิ่มการยืมคืนใหม่</h2>

            <input
              type="text"
              name="job"
              placeholder="ชื่องาน"
              value={formData.job}
              onChange={handleChange}
            />

            <div className="date-row">

              <input
                type="date"
                name="borrowDate"
                value={formData.borrowDate}
                onChange={handleChange}
              />

              <input
                type="date"
                name="returnDate"
                value={formData.returnDate}
                onChange={handleChange}
              />

            </div>

            <input
              type="text"
              name="manager"
              placeholder="ชื่อผู้ดูแล"
              value={formData.manager}
              onChange={handleChange}
            />

            <input
              type="text"
              name="phone"
              placeholder="เบอร์โทร"
              value={formData.phone}
              onChange={handleChange}
            />

            <button
              className="btn-save"
              onClick={handleAdd}
            >
              บันทึก
            </button>

            <button
              className="btn-close"
              onClick={() => setShowModal(false)}
            >
              ยกเลิก
            </button>

          </div>

        </div>

      )}

    </div>
  );
}
