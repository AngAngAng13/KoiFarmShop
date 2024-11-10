import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Button,
  Typography,
  Spin,
  Alert,
  Layout,
  Divider,
  Row,
  Col,
  Tooltip,
  Modal,
} from "antd";
import { HomeOutlined, CopyOutlined } from "@ant-design/icons";
import axiosInstance from "../An/Utils/axiosJS";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const { Title, Text } = Typography;

export default function DonKyGui() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const message_ConFirm = queryParams.get("message");
  const [consignList, setConsignList] = useState([]);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConsignList = async () => {
      try {
        const response = await axiosInstance.get("/users/tat-ca-don-ki-gui");

        if (response.data.result && response.data.result.data) {
          setConsignList(response.data.result.data);
        } else {
          console.error("No data found in result.");
        }
      } catch (error) {
        setError(error.message);
        console.error("Error fetching consign list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConsignList();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("users/me");
      if (response.data) {
        setUserData(response.data.result);
        console.log("Fetched user data:", response.data.result);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);
  const handleOk = () => {
    // Thực hiện hành động xóa
    navigate(`/xoa`, {
      state: { consign },
    });
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    message.success("ID đã được sao chép!");
  };

  if (loading)
    return (
      <Spin
        size="large"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      />
    );
  if (error) return <Alert message="Error" description={error} type="error" />;
  if (message_ConFirm) {
    toast.success(message_ConFirm);
  }

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Layout style={{ backgroundColor: "whitesmoke" }}>
        <Container style={{ paddingTop: "35px", paddingBottom: "10px" }}>
          <Row gutter={16}>
            <Col span={24}>
              <Title
                level={4}
                style={{
                  textAlign: "left",
                  marginBottom: "55px",
                  marginLeft: "15px",
                }}
              >
                Danh Sách Ký Gửi Của Khách Hàng
              </Title>
            </Col>
          </Row>
          <Divider style={{ margin: "20px 0" }} />
          <Row gutter={16}>
            {consignList.length > 0 ? (
              consignList.map((item) => {
                const { consign, koi } = item;
                return (
                  <Col
                    span={24}
                    key={consign._id}
                    style={{ marginBottom: "20px" }}
                  >
                    <div
                      style={{
                        padding: "20px",
                        border: "1px solid #d9d9d9",
                        borderRadius: "8px",
                        backgroundColor: "#fff",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <Text
                        strong
                        style={{
                          fontSize: "25px",
                          fontWeight: "bold",
                          color: "blue",
                        }}
                      >
                        {koi?.KoiName}
                      </Text>
                      <div style={{ display: "flex" }}>
                        <div style={{ marginTop: "20px" }}>
                          <Text style={{ fontWeight: "bold" }}>
                            <span
                              style={{
                                color: "red",
                                fontWeight: "bold",
                                fontSize: "16px",
                              }}
                            >
                              Age{" "}
                            </span>
                            {koi?.Age ?? "N/A"} years
                          </Text>
                          <div style={{ marginBottom: "8px" }}></div>
                          <Text style={{ fontWeight: "bold" }}>
                            <span
                              style={{
                                color: "red",
                                fontWeight: "bold",
                                fontSize: "16px",
                              }}
                            >
                              Price{" "}
                            </span>
                            {koi?.Price || "Chờ bên shop định giá"}
                          </Text>
                        </div>
                        <div style={{ marginLeft: "300px", marginTop: "22px" }}>
                          <Text>
                            <span
                              style={{
                                color: "red",
                                fontWeight: "bold",
                                fontSize: "16px",
                              }}
                            >
                              Tình trạng{" "}
                            </span>
                            {(() => {
                              const statusText = [
                                "Yêu cầu ký gửi",
                                "Đang kiểm tra Koi",
                                "Đang thương thảo hợp đồng",
                                "Đang tìm người mua",
                                "Đã bán",
                              ][consign.State - 1];

                              let color;
                              if (
                                consign.State === 1 ||
                                consign.State === 2 ||
                                consign.State === 3
                              ) {
                                color = "blue";
                              } else if (consign.State === 4) {
                                color = "";
                              } else if (consign.State === 5) {
                                color = "green";
                              }

                              return (
                                <Text style={{ color }}>{statusText}</Text>
                              );
                            })()}
                          </Text>

                          <div style={{ marginTop: "10px" }}>
                            <Text strong style={{ color: "black" }}>
                              <span
                                style={{
                                  color: "red",
                                  fontWeight: "bold",
                                  fontSize: "16px",
                                }}
                              >
                                Ngày giao hàng{" "}
                              </span>
                              {consign.ShippedDate
                                ? new Date(
                                    consign.ShippedDate
                                  ).toLocaleDateString("vi-VN", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  })
                                : "Không yêu cầu"}
                            </Text>
                            <br />
                            <Text strong style={{ color: "black" }}>
                              <span
                                style={{
                                  color: "red",
                                  fontWeight: "bold",
                                  fontSize: "16px",
                                }}
                              >
                                Ngày nhận hàng{" "}
                              </span>
                              {consign.ReceiptDate
                                ? new Date(
                                    consign.ReceiptDate
                                  ).toLocaleDateString("vi-VN", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  })
                                : "Không yêu cầu"}
                            </Text>
                          </div>
                        </div>
                      </div>

                      <Divider />
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Tooltip title="Đây là ID cho đơn hàng của bạn, xin không cung cấp cho người khác.">
                            <Text
                              strong
                              style={{
                                display: "inline-block",
                                maxWidth: "200px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              Đơn gửi: {consign._id}{" "}
                              <span style={{ color: "#999" }}>?</span>
                            </Text>
                          </Tooltip>
                          <Button
                            type="link"
                            onClick={() => handleCopy(consign._id)}
                            style={{ color: "grey" }}
                          >
                            <CopyOutlined />
                          </Button>
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Text style={{ marginLeft: "10px" }}>
                            <span
                              style={{
                                fontWeight: "bold",
                                color: "orange",
                                fontSize: "16px",
                              }}
                            >
                              Tổng tiền{" "}
                            </span>
                            {consign.TotalPrice
                              ? new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(consign.TotalPrice)
                              : "Chờ bên shop định giá"}
                          </Text>
                          <Button
                            type="primary"
                            style={{ marginLeft: "10px" }}
                            onClick={() => {
                              navigate(`/`);
                            }}
                          >
                            Chat ngay
                          </Button>
                          <Button
                            style={{ marginLeft: "10px" }}
                            type="default"
                            onClick={() => {
                              navigate(`/chitiet`, {
                                state: { consign },
                              });
                            }}
                          >
                            Chi tiết
                          </Button>
                          <Button
                            style={{ marginLeft: "10px", color: "red" }}
                            type="danger" // This should apply the red color
                            onClick={showModal}
                          >
                            Xóa đơn ký gửi
                          </Button>
                          <Modal
                            title="Xác nhận xóa"
                            visible={isModalVisible}
                            onOk={handleOk}
                            onCancel={handleCancel}
                          >
                            <p>
                              Bạn có chắc chắn muốn xóa đơn ký gửi này không?
                            </p>
                          </Modal>
                          {consign.Status === -1 && (
                            <div>
                              <h3>Đơn ký gửi nãy đã hủy</h3>
                            </div>
                          )}
                        </div>
                      </div>

                      <Divider style={{ margin: "20px 0" }} />
                      <Text strong style={{ fontSize: "17px" }}>
                        Thông tin người dùng
                      </Text>
                      <div style={{ display: "flex" }}>
                        <div style={{ marginTop: "20px" }}>
                          <Text style={{ fontWeight: "bold" }}>
                            <span
                              style={{
                                color: "red",
                                fontWeight: "bold",
                                fontSize: "16px",
                              }}
                            >
                              Tên người ký gửi{" "}
                            </span>
                            {userData?.name ?? "N/A"}
                          </Text>
                          <div style={{ marginBottom: "8px" }}></div>
                          <Text style={{ fontWeight: "bold" }}>
                            <span
                              style={{
                                color: "red",
                                fontWeight: "bold",
                                fontSize: "16px",
                              }}
                            >
                              Email{" "}
                            </span>
                            {userData?.email ?? "N/A"}
                          </Text>
                        </div>
                        <div style={{ marginLeft: "220px", marginTop: "22px" }}>
                          <Text style={{ fontWeight: "bold" }}>
                            <span
                              style={{
                                color: "red",
                                fontWeight: "bold",
                                fontSize: "16px",
                              }}
                            >
                              Số điện thoại của người ký gửi{" "}
                            </span>
                            {consign?.PhoneNumberConsignKoi ??
                              "Người dùng chưa cung cấp SĐT"}
                          </Text>
                          <div style={{ marginTop: "10px" }}>
                            <Text style={{ fontWeight: "bold" }}>
                              <span
                                style={{
                                  color: "red",
                                  fontWeight: "bold",
                                  fontSize: "16px",
                                }}
                              >
                                Địa chỉ ký gửi{" "}
                              </span>
                              {""}
                              {consign?.AddressConsignKoi ?? "N/A"}
                            </Text>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                );
              })
            ) : (
              <Col span={24}>
                <Text>No consign items available.</Text>
              </Col>
            )}
          </Row>
        </Container>
      </Layout>
    </div>
  );
}
