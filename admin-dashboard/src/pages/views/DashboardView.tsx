import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Statistic,
  Typography,
  Space,
  Card,
  message,
  Divider,
  Tooltip as AntTooltip,
} from "antd";
import {
  UserOutlined,
  FileImageOutlined,
  FolderOutlined,
  WarningOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Column, Liquid } from "@ant-design/charts";
import { getDashboardStats } from "@/api/dashboard";
import { ROUTES } from "@/constants/routes";

const { Title, Text } = Typography;

// --- 1. Reusable Stylish Card Component ---
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
  loading?: boolean;
  suffix?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  onClick,
  loading,
  suffix,
}) => {
  return (
    <Card
      hoverable
      onClick={onClick}
      loading={loading}
      style={{
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        border: "none",
        height: "100%",
        position: "relative",
      }}
      bodyStyle={{ padding: "20px 24px" }}
    >
      <div
        style={{
          position: "absolute",
          right: -20,
          bottom: -20,
          fontSize: 100,
          opacity: 0.1,
          color: color,
          transform: "rotate(-15deg)",
          pointerEvents: "none",
        }}
      >
        {icon}
      </div>

      <Space direction="vertical" size={0}>
        <Text type="secondary" style={{ fontSize: 14, fontWeight: 500 }}>
          {title.toUpperCase()}
        </Text>
        <Statistic
          value={value}
          valueStyle={{
            fontWeight: 700,
            fontSize: 28,
            color: color,
          }}
          prefix={
            <span
              style={{
                backgroundColor: `${color}20`,
                padding: 8,
                borderRadius: "50%",
                display: "inline-flex",
                marginRight: 8,
                fontSize: 18,
                color: color,
              }}
            >
              {icon}
            </span>
          }
          suffix={
            suffix && (
              <span style={{ fontSize: 14, color: "#8c8c8c" }}>{suffix}</span>
            )
          }
        />
      </Space>
    </Card>
  );
};

// --- 2. Main Dashboard Component ---
const DashboardView: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMedias: 0,
    totalAlbums: 0,
    totalPolicyViolations: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await getDashboardStats();
        const statsData = response.data;
        setStats({
          totalUsers: statsData.total_users || 0,
          totalMedias: statsData.total_media || 0,
          totalAlbums: statsData.total_albums || 0,
          totalPolicyViolations: statsData.total_media_policy_violation || 0,
        });
      } catch (error: unknown) {
        console.error("Error fetching dashboard stats:", error);
        message.error("Failed to fetch dashboard statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // --- Data Processors ---

  const columnData = useMemo(() => {
    return [
      { type: "Users", value: stats.totalUsers, category: "System" },
      { type: "Albums", value: stats.totalAlbums, category: "System" },
      { type: "Media", value: stats.totalMedias, category: "Content" },
      {
        type: "Violations",
        value: stats.totalPolicyViolations,
        category: "Safety",
      },
    ];
  }, [stats]);

  const violationRate = useMemo(() => {
    if (stats.totalMedias === 0) return 0;
    return stats.totalPolicyViolations / stats.totalMedias;
  }, [stats]);

  // Tính toán %
  const cleanCount = stats.totalMedias - stats.totalPolicyViolations;
  const cleanPercentage =
    stats.totalMedias > 0
      ? ((cleanCount / stats.totalMedias) * 100).toFixed(2)
      : "0.00";

  const flaggedPercentage =
    stats.totalMedias > 0
      ? ((stats.totalPolicyViolations / stats.totalMedias) * 100).toFixed(2)
      : "0.00";

  // --- Chart Configs ---

  const columnConfig = {
    data: columnData,
    xField: "type",
    yField: "value",
    seriesField: "type",
    label: {
      position: "top" as const,
      style: { fill: "#666", opacity: 0.6 },
    },
    xAxis: { label: { autoHide: true, autoRotate: false } },
    color: ({ type }: { type: string }) => {
      if (type === "Violations") return "#ff4d4f";
      if (type === "Users") return "#1890ff";
      if (type === "Media") return "#52c41a";
      return "#faad14";
    },
    columnStyle: { radius: [6, 6, 0, 0] },
    height: 300,
  };

  // --- Chart Configs ---

  // ... (giữ nguyên columnConfig)

  // Cấu hình Liquid fix cứng hiển thị và tăng kích thước
  const liquidConfig = useMemo(() => {
    return {
      percent: violationRate,
      radius: 0.95, // <--- Tăng từ 0.8 lên 0.95 để hình tròn to ra sát viền
      outline: {
        border: 4,
        distance: 4, // Giảm khoảng cách viền để trông gọn hơn khi to ra
      },
      wave: { length: 128 },
      theme: {
        styleSheet: {
          brandColor: "#ff4d4f",
        },
      },
      statistic: {
        title: false,
        content: {
          style: {
            fontSize: "17px", // Tăng size chữ cho cân đối với hình tròn to
            lineHeight: 1,
            fontWeight: "medium",
            color: "black",
          },
          // FIX CỨNG: Tính toán lại và ép kiểu chuỗi tại đây
          formatter: () => {
            // Đảm bảo luôn lấy 2 số thập phân từ biến gốc
            return `${(violationRate * 100).toFixed(2)}%`;
          },
        },
      },
      tooltip: {
        formatter: () => {
          return {
            name: "Violation Rate",
            value: `${(violationRate * 100).toFixed(2)}%`,
          };
        },
      },
      height: 200, // <--- Tăng chiều cao lên một chút để hình tròn không bị cắt
    };
  }, [violationRate]);
  return (
    <div
      style={{ padding: 24, minHeight: "100vh", backgroundColor: "#f0f2f5" }}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <Title level={3} style={{ margin: 0 }}>
              Dashboard Overview
            </Title>
            <Text type="secondary">Welcome back, Admin</Text>
          </div>
          <Text type="secondary">{new Date().toLocaleDateString()}</Text>
        </div>

        {/* --- Top Statistics Row --- */}
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon={<UserOutlined />}
              color="#1890ff"
              onClick={() => navigate(ROUTES.USER_MANAGEMENT)}
              loading={loading}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="Total Media"
              value={stats.totalMedias}
              icon={<FileImageOutlined />}
              color="#52c41a"
              onClick={() => navigate(ROUTES.MEDIA_MANAGEMENT)}
              loading={loading}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="Total Albums"
              value={stats.totalAlbums}
              icon={<FolderOutlined />}
              color="#faad14"
              onClick={() => navigate(ROUTES.ALBUM_MANAGEMENT)}
              loading={loading}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="Policy Violations"
              value={stats.totalPolicyViolations}
              icon={<WarningOutlined />}
              color="#ff4d4f"
              onClick={() => navigate(ROUTES.MEDIA_POLICY_DETECT)}
              loading={loading}
              suffix="cases"
            />
          </Col>
        </Row>

        {/* --- Analytics Section --- */}
        <Row gutter={[24, 24]}>
          {/* Cột này giờ chiếm toàn bộ chiều rộng (span 24) */}
          <Col span={24}>
            <Space direction="vertical" size={24} style={{ width: "100%" }}>
              {/* 1. Entity Comparison */}
              <Card
                title="Entity Comparison"
                loading={loading}
                bordered={false}
                style={{
                  borderRadius: 12,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
              >
                <Column {...columnConfig} />
              </Card>

              {/* 2. Policy Health Check */}
              <Card
                title={
                  <Space>
                    Policy Health Check
                    <AntTooltip title="Ratio of flagged content against total media">
                      <InfoCircleOutlined style={{ color: "#ccc" }} />
                    </AntTooltip>
                  </Space>
                }
                loading={loading}
                bordered={false}
                style={{
                  borderRadius: 12,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
              >
                <Row align="middle" gutter={24}>
                  <Col xs={24} md={8}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <Liquid {...liquidConfig} />
                    </div>
                  </Col>
                  <Col xs={24} md={16}>
                    <Title level={4}>Media Safety Status</Title>
                    <Text type="secondary">
                      Real-time analysis of uploaded content compliance.
                    </Text>
                    <Divider style={{ margin: "12px 0" }} />
                    <Row gutter={16}>
                      <Col span={12}>
                        <Statistic
                          title="Clean Media"
                          value={cleanCount}
                          valueStyle={{ color: "#52c41a" }}
                          suffix={
                            <span
                              style={{
                                fontSize: 14,
                                color: "#8c8c8c",
                                marginLeft: 8,
                              }}
                            >
                              ({cleanPercentage}%)
                            </span>
                          }
                        />
                      </Col>
                      <Col span={12}>
                        <Statistic
                          title="Flagged"
                          value={stats.totalPolicyViolations}
                          valueStyle={{ color: "#ff4d4f" }}
                          suffix={
                            <span
                              style={{
                                fontSize: 14,
                                color: "#8c8c8c",
                                marginLeft: 8,
                              }}
                            >
                              ({flaggedPercentage}%)
                            </span>
                          }
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>
            </Space>
          </Col>
        </Row>
      </Space>
    </div>
  );
};

export default DashboardView;
