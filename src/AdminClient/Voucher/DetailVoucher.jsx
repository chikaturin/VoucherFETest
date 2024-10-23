import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faEdit,
  faXmark,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const DetailVoucher = () => {
  const { id } = useParams();
  const [voucher, setVoucher] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const URL = "https://servervoucher.vercel.app/api";

  const handlestate = async (id) => {
    try {
      const res = await fetch(`${URL}/updateState/${id}`, {
        method: "GET",
      });
      const voucher = await res.json();
      if (res.status === 400) {
        alert("Error: " + (voucher.message || "Failed to update state"));
      } else {
        alert("Update State Success");
        navigate(`/Partner/ListVoucher/`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const date = (a) => {
    return new Date(a).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const DetailFetch = async () => {
    try {
      const res = await fetch(`${URL}/DetailVoucher/${id}`);
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      console.log("Dữ liệu nhận được:", data);
      setVoucher(data[0]);
    } catch (error) {
      setError("Không thể lấy dữ liệu từ máy chủ");
      console.error("Lỗi fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("voucher updated:", voucher);
  }, [voucher]);

  useEffect(() => {
    DetailFetch();
  }, [id]);

  const handleDeleteVoucher = async (id) => {
    try {
      const res = await fetch(`${URL}/deleteVoucher/${id}`, {
        method: "GET",
      });
      const voucher = await res.json();
      if (res.status === 200) {
        alert("Xóa voucher thành công");
        DetailFetch();
      } else {
        alert("Error: " + (voucher.message || "Failed to delete voucher"));
      }
    } catch (error) {
      console.log(error);
    }
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
    <div className="lg:bg-[#eaf9e7] bg-[#4ca771]">
      {console.log("voucher:", voucher)}
      <div className="w-full bg-[#eaf9e7] p-4 rounded-t-xl">
        <div className="grid grid-cols-12 text-[#4ca771]">
          <div className="col-span-11 flex items-center">
            <h1 className="text-4xl mt-4 mb-10 w-full text-left font-bold px-10">
              Chi tiết voucher
            </h1>
          </div>
          <div className="col-span-1 flex items-center ">
            <Link to={`/Admin/Listvoucher`}>
              <button className="bg-[#eaf9e7] hover:bg-[#4ca771] w-10 h-10 border-4 border-[#4ca771] hover:text-[#eaf9e7] font-bold rounded-full">
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </Link>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 grid-cols-1">
          <div className="p-10">
            <img
              className="w-full rounded-xl h-auto object-cover"
              src={voucher.Image}
              alt="Voucher"
            />
          </div>
          <div className="w-full text-[#2F4F4F]">
            <h1 className="text-3xl font-bold mb-2">{voucher.Name}</h1>
            <div className="w-full border-b border-[#4ca771] mb-10">
              <span className="text-xl text-[#4ca771]">{voucher._id}</span>
              <span className="float-right font-bold text-xl text-[#4ca771]">
                Trạng thái:{" "}
                <span
                  className={`font-normal ${
                    voucher.States === "enable"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {voucher.States}
                </span>
              </span>
            </div>
            <div>
              <p className="text-xl my-2 flex justify-between pr-10">
                <span className="font-bold text-[#4ca771]">
                  Số lượng còn lại:{" "}
                </span>
                {voucher.RemainQuantity || "N/A"}
              </p>
              <p className="text-xl my-2 flex justify-between pr-10">
                <span className="font-bold text-[#4ca771]">Mức giảm: </span>
                {voucher.PercentDiscount || "N/A"}%
              </p>
              <p className="text-xl my-2 flex justify-between pr-10">
                <span className="font-bold text-[#4ca771]">Mô tả: </span>
                {voucher.Description || "N/A"}
              </p>
              <div className="my-4">
                {voucher.conditions && voucher.conditions.length > 0 ? (
                  voucher.conditions.map((condition) => (
                    <div
                      key={condition._id}
                      className="shadow-inner shadow-[#c0e6ba] rounded-lg p-2 mb-2 font-semibold bg-white"
                    >
                      <p>
                        Giá trị tối thiểu:{" "}
                        <span className="text-[#4ca771] font-normal">
                          {condition.MinValue}đ
                        </span>
                      </p>
                      <p>
                        Giá trị tối đa:{" "}
                        <span className="text-[#4ca771] font-normal">
                          {condition.MaxValue}đ
                        </span>
                      </p>
                    </div>
                  ))
                ) : (
                  <p>Không có điều kiện áp dụng.</p>
                )}
              </div>
              <div className="my-4 bg-white shadow-inner shadow-[#c0e6ba] rounded-lg p-2 mb-5">
                {voucher.haveVouchers && voucher.haveVouchers.length > 0 ? (
                  voucher.haveVouchers.map((haveVoucher) => (
                    <div key={haveVoucher._id}>
                      <p>
                        <span className="text-[#4ca771] font-semibold">
                          Service:
                        </span>{" "}
                        {haveVoucher.Service_ID}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-[#4ca771] font-semibold">
                    Toàn bộ service
                  </p>
                )}
              </div>
              <p className="text-xl my-2 flex justify-between pr-10">
                <span className="font-bold text-[#4ca771]">Hạn sử dụng:</span>
                <span>
                  {voucher.ReleaseTime ? date(voucher.ReleaseTime) : "N/A"}
                  <span> - </span>
                  {voucher.ExpiredTime ? date(voucher.ExpiredTime) : "N/A"}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-10 w-full justify-center mt-10">
          <div className="col-span-1"></div>
          <div className="col-span-3">
            <Link
              to={`/Partner/EditVoucherPN/${id}`}
              className="bg-[#4ca771] hover:bg-[#eaf9e7] font-bold text-lg text-[#eaf9e7] hover:text-[#4ca771] border-2 border-[#4ca771] p-5 rounded-lg flex items-center justify-center w-full"
            >
              <FontAwesomeIcon icon={faEdit} />
              <span className="ml-2">Edit</span>
            </Link>
          </div>
          <div className="col-span-3 gap-10">
            <button
              className="bg-[#2F4F4F] hover:bg-[#eaf9e7] font-bold text-lg text-[#eaf9e7] hover:text-[#2F4F4F] border-2 border-[#2F4F4F] p-5 rounded-lg flex items-center justify-center w-full"
              onClick={() => handleDeleteVoucher(id)}
            >
              <FontAwesomeIcon icon={faTrash} />
              <span className="ml-2">Delete</span>
            </button>
          </div>
          <div className="col-span-3 gap-10">
            <button
              className="bg-[#3bb0b0] hover:bg-[#eaf9e7] font-bol outline-none text-lg text-[#eaf9e7] hover:text-[#3bb0b0] border-2 border-[#3bb0b0] p-5 rounded-lg flex items-center justify-center w-full"
              onClick={() => handlestate(id)}
            >
              <FontAwesomeIcon icon={faWrench} />
              <span className="ml-2"> State</span>
            </button>
          </div>
          <div className="col-span-1"></div>
        </div>
      </div>
    </div>
  );
};

export default DetailVoucher;
