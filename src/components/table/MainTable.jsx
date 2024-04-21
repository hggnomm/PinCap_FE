import { Table } from 'antd';
import React from 'react'

const MainTable = ({ columns, data, onChange, tableStyle }) => 
{
  return (
    <Table 
      rowKey={data => data.idCampaign}
      columns={columns}
      dataSource={data}
      onChange={onChange}
      className={tableStyle}
    >
    </Table>
  )
}

export default MainTable