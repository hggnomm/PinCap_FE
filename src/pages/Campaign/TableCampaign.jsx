import { Button, Col, Row, notification } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import MainTable from '../../components/table/MainTable'
import { EditFilled, EyeOutlined } from '@ant-design/icons'
import { AuthContext } from '../../context/AuthContext'
import EmeterForm from '../../components/form/EmeterForm'
import jwtDecode from 'jwt-decode'
import { createAndUpdateCampaign, deleteCampaign, getAllCampaigns, getCampaignById } from '../../api'
import moment from 'moment';

const getStatusText = (status) => {
  switch (status) {
    case 0:
      return 'OPEN';
    case 1:
      return 'HIDDEN';
    case 2:
      return 'CLOSED';
    case 3:
      return 'CANCELED';
    default:
      return 'Unknown';
  }
};

const getLocationText = (location) => {
  switch (location) {
    case 0:
      return 'HCM';
    case 1:
      return 'HN';
    case 2:
      return 'ĐN';
    default:
      return 'Unknown';
  }
};

// MAIN CONTENT
const TableCampaign = () => {
  const [listCampaign, setListCampaign] = useState([])
  const { token } = useContext(AuthContext)
  const [visible1, setVisible1] = useState(false)
  const [visible2, setVisible2] = useState(false)
  const [visible3, setVisible3] = useState(false)
  const [idCampaign, setIdCampaign] = useState("")
  const [role, setRole] = useState("")
  const [refreshTable, setRefreshTable] = useState(false)
  const [api, contextHolder] = notification.useNotification();

  const [rowData, setRowData] = useState({
    idCampaign: "",
    campaignName: "",
    status: 0,
    salary: 0,
    location: 0,
    expirationDate: ""
  })

   // Columns
   const columns = [
    {
      
      title: 'Action',
      render: (text, record) => (
        <>
         { role == "ADMIN" && <Button 
          onClick={() => getValueById(record)}
          icon={<EditFilled/>}
          >
          </Button>}
          {role != "ADMIN" && <Button 
          onClick={()=> getValueById(record)}
          icon={<EyeOutlined />}
          >
          </Button>}
        </>
       ),
       width: '7%',  
    },
    {
      title: 'Campaign',
      dataIndex: 'campaignName',
      width: '35%',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => getStatusText(status),
    },
    {
      title: 'Salary',
      width: '15% ',
      dataIndex: 'salary',
      sorter: (a, b) => a.salary - b.salary,
    },
    {
      title: 'Campaign Place',
      width: '10% ',
      dataIndex: 'location',
      render: (location) => getLocationText(location),
  
    },
    {
      title: 'End Date',
      dataIndex: 'expirationDate',
      render: (text) => moment(text).format('DD-MM-YYYY')
    }
  ]

  useEffect(() => {
    if(token) {
        getAllCampaigns()
        .then(dataList => {
            setListCampaign(dataList)
        })
        .catch(error => {
            console.error('Error fetching campaigns:', error);
        });
        setRole(token.role)
    }
  }, [refreshTable])

  // CREATE AND UPDATE
  const onCreateUpdate = async (values) => {
    console.log(rowData.idCampaign)
    try {
      let result
        if (rowData.idCampaign) {
          const updateData = {
            ...rowData,
            ...values
          }
          result = await createAndUpdateCampaign(updateData, token);
          setRowData(null)
          setRefreshTable(!refreshTable)
          setVisible2(!visible2);
          notification.success({
            message: "Update Successful",
            description: "The campaign has been updated successfully.",
          });
        } else {
          result = await createAndUpdateCampaign(values, token);
          setRowData(null)
          setRefreshTable(!refreshTable) 
          setVisible1(!visible1)     
          notification.success({
            message: "Create Successful",
            description: "The campaign has been created successfully.",
          })
        }
    } catch (e) {
      console.log(e)
    }
  }  

  // GET BY ID
  const getValueById = async (record) => {
    role == "ADMIN" ? setVisible2(!visible2) : setVisible3(!visible3)
    setIdCampaign(record.idCampaign)
    try {
      const result = await getCampaignById(record.idCampaign, token)
      setRowData(result)
    } catch (e) {
      console.log(e)
    }
  }
 
  // DELETE
  const onDelete = async () => {
    try {
      const result = await deleteCampaign(idCampaign, token)
      if(result == true) {
        notification.success({
          message: "Delete Successful",
          description: "The campaign has been delete successfully.",
        })
      }
      setRefreshTable(!refreshTable)
    } catch (e) {
      console.log(e)
    }
  }

  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  return (
    <Row className='layout-content'>
      <Row className='action-campaign'>
        <Col className='title'>
            List Campaign
        </Col>
        <Col>
        {/* check Role */}
          {role == "ADMIN" &&
          <Button className='btn' onClick={() => setVisible1(true)}>
            New Campaign
          </Button> 
         }
        </Col>
      </Row>

      {/* Table */}
      <Row className='layout-table'>
        <MainTable 
          columns={columns}
          data={listCampaign}
          onChange={onChange}
          tableStyle={"table"}
        />
      </Row>

      {/* Create Campaign form */}
      <EmeterForm 
        rowData={null}
        destroyOnClose={true}
        open={visible1}
        onSave={onCreateUpdate}
        onCancel={() => {
          setVisible1(false);
        }}
        text="Create"
        title="Create a new campaign"
      />

      {/* Edit Campaign form */}
      { rowData && <EmeterForm 
        open={visible2}
        onSave={onCreateUpdate}
        onCancel={() => {
          setRowData({});
          setVisible2(false);
        }}
        title="Update a campaign"
        text="Update"
        rowData={rowData}
        onDelete={<Button onClick={onDelete} type="primary" danger >Delete</Button>}
      />}

      {/* View */}
      <EmeterForm
        open={visible3}
        onCancel={() => {
          setVisible3(false);
        }}
        title="View a campaign"
        rowData={rowData}
        disabled={true}
      >
      </EmeterForm>
    </Row>
  )
}

export default TableCampaign