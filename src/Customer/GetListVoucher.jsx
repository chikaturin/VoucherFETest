import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faEdit,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";

const GetListVoucher = () => {
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [note, setNote] = useState(null);
  const [PriceDiscount, setPriceDiscount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderPrice, setOrderPrice] = useState(500000);
  const URL = "https://servervoucher.vercel.app/api";
  const navigate = useNavigate();

  const FetchNote = async () => {
    try {
      const response = await fetch(`${URL}/GetNote/OD123`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("data note", data);
      setNote(data);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    FetchNote();
  }, []);

  useEffect(() => {
    if (note && note.CusID) {
      console.log("cusID ", note.CusID);
    }
  }, [note]);

  const GetVoucher = async () => {
    try {
      const response = await fetch(`${URL}/getVoucherByCus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CusID: note.CusID,
          Service_ID: note.Service_ID,
          Price: note.Price,
        }),
      });

      const data = await response.json();

      console.log("data", data);
      if (Array.isArray(data)) {
        setVouchers(data);
      } else {
        setVouchers([]);
      }

      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (note && note.CusID && note.Service_ID && note.Price) {
      GetVoucher();
    }
  }, [note]);

  const setDiscount = async (idVoucher) => {
    try {
      const response = await fetch(`${URL}/CalculateVoucher`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: idVoucher,
          Price: Number(orderPrice),
        }),
      });

      if (!response.ok) {
        throw new Error("Server error: " + response.statusText);
      }

      const data = await response.json();

      setPriceDiscount(data);
    } catch (error) {
      console.error("Error:", error.message);
      setError(error.message);
      setLoading(false);
    }
  };

  const submitApplyVouhcer = async (voucherId) => {
    try {
      const response = await fetch(`${URL}/ApplyVoucher/${voucherId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CusID: "Thanh1", //thay thế dữ liệu nha đại ca
          TotalDiscount: PriceDiscount,
          Price: 450000, //thay tiền get dữ liệu về nha
        }),
      });
      const data = await response.json();
      if (response.status === 200) {
        alert("Áp dụng voucher thành công");
        GetVoucher();
      } else {
        alert("Error: " + (data.message || "Failed to apply voucher"));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="text-center w-full text-4xl translate-y-1/2 h-full font-extrabold">
        Loading...
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center w-full text-4xl translate-y-1/2 h-full font-extrabold">
        {error}
      </div>
    );
  }

  return (
    <div>
      <header className="w-full grid grid-cols-2 bg-[#437fc7] h-20">
        {/* <img src={logo} alt="" className="-20 w-20" /> */}
      </header>
      <div className="grid lg:grid-cols-3 gap-6 w-full bg-[#ffffff] min-h-screen p-6">
        <div className="lg:col-span-2 bg-[#edf6ff] rounded-xl p-6">
          <p className="w-full text-center font-bold text-3xl text-[#437fc7] my-4">
            DANH SÁCH VOUCHER
          </p>
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
            {vouchers.map((voucher) => (
              <div
                key={voucher._id}
                className="w-full bg-[#ffffff] rounded-xl p-4 cursor-pointer"
                onClick={() => {
                  setSelectedVoucher(voucher);
                  // setPriceDiscount(
                  //   orderPrice * (voucher.PercentDiscount / 100)
                  // );
                  setDiscount(voucher._id);
                }}
              >
                <p className="text-xl font-bold text-[#b9732f] mb-4">
                  {voucher.Name}
                </p>
                <p className="text-lg text-[#437fc7]">
                  Giảm{" "}
                  <span className="font-bold">{voucher.PercentDiscount}%</span>{" "}
                  trên tổng tiền
                </p>
                <p className="text-lg text-[#b9732f]">
                  Có giá trị từ ngày{" "}
                  <span className="text-[#437fc7]">
                    {formatDate(voucher.ReleaseTime)}
                  </span>{" "}
                  đến{" "}
                  <span className="text-[#437fc7]">
                    {formatDate(voucher.ExpiredTime)}
                  </span>
                </p>
              </div>
            ))}
          </div>
          <p
            className="w-full text-center font-bold text-xl bg-[#b9732f] hover:bg-[#ffffff] text-[#edf6ff] hover:text-[#b9732f] p-3 mb-4 mt-10 rounded-xl cursor-pointer"
            onClick={() => {
              setSelectedVoucher(null);
              setPriceDiscount(0);
            }}
          >
            Deselect voucher
          </p>
        </div>
        <div className="col-span-1 bg-[#edf6ff] rounded-xl p-6">
          <p className="w-full font-bold text-3xl text-[#437fc7] my-4">
            THÔNG TIN ĐƠN HÀNG
          </p>
          <div className="w-full grid grid-cols-2 bg-[#ffffff] p-4 rounded-xl text-lg">
            <div className="w-full font-bold text-[#b9732f] py-2">
              Đơn hàng:
            </div>
            <div className="w-full text-end text-[#437fc7] py-2">123</div>
            <div className="w-full font-bold text-[#b9732f] py-2">
              Giá tiền:
            </div>
            <div className="w-full text-end text-[#437fc7] py-2">
              {orderPrice}đ
            </div>
            <div className="w-full font-bold text-[#b9732f] py-2">Giảm:</div>
            <div className="w-full text-end text-[#437fc7] py-2">
              {PriceDiscount}đ
            </div>
            <div className="w-full font-bold text-[#b9732f] py-2 text-xl">
              Tổng cộng:
            </div>
            <div className="w-full text-end text-[#437fc7] py-2 text-xl">
              {orderPrice - PriceDiscount}đ
            </div>
          </div>
          <p className="w-full font-bold text-3xl text-[#437fc7] mb-4 mt-10">
            VOUCHER ĐÃ CHỌN
          </p>
          {selectedVoucher ? (
            <div
              key={selectedVoucher._id}
              className="w-full bg-[#ffffff] rounded-xl p-4"
            >
              <div className="w-full">
                <div className="w-full">
                  <p className="text-xl font-bold text-[#b9732f] mb-4">
                    {selectedVoucher.Name}
                  </p>
                  <p className="text-lg text-[#b9732f] mb-4">
                    Có giá trị từ ngày{" "}
                    <span className="text-[#437fc7]">
                      {formatDate(selectedVoucher.ReleaseTime)}
                    </span>{" "}
                    đến{" "}
                    <span className="text-[#437fc7]">
                      {formatDate(selectedVoucher.ExpiredTime)}
                    </span>
                  </p>
                  <p className="text-lg text-[#437fc7] mb-4">
                    Giảm{" "}
                    <span className="font-bold">
                      {selectedVoucher.PercentDiscount}%
                    </span>{" "}
                    cho đơn hàng từ{" "}
                    <span className="font-bold">
                      {selectedVoucher.MinCondition}đ
                    </span>
                  </p>
                  {selectedVoucher.conditions.map((condition) => (
                    <p className="text-lg text-[#437fc7]" key={condition._id}>
                      Giảm tối đa{" "}
                      <span className="font-bold">{condition.MaxValue}đ</span>{" "}
                      cho đơn hàng từ{" "}
                      <span className="font-bold">{condition.MinValue}đ</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="w-full text-center text-2xl text-[#b9732f] my-4">
              Chưa chọn voucher!!!
            </p>
          )}
          <p
            id="applyBtn"
            className="cursor-pointer w-full text-center font-bold text-3xl bg-[#437fc7] hover:bg-[#ffffff] text-[#edf6ff] hover:text-[#437fc7] p-4 mb-4 mt-10 rounded-xl"
          >
            APPLY
          </p>
        </div>
      </div>
    </div>
  );
};

export default GetListVoucher;
