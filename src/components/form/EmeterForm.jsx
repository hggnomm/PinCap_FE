import { DatePicker, Form, Input, Modal, Select } from "antd"
import { useEffect, useState } from "react";
import moment from 'moment';

const EmeterForm = ({ open, onSave, onCancel, title, text, rowData, onDelete, disabled })  => {
    const [form] = Form.useForm();
    const dateFormat = "YYYY/MM/DD";

    useEffect(() => {
        form.resetFields();
        // form.setFieldValue(rowData)
    }, [rowData])
return (
    <Modal
        open={open}
        title={title}
        okText={text}
        cancelText="Cancel"
        onCancel={onCancel}
        onOk={() => {
            form
            .validateFields()
            .then(values => {
            form.resetFields();
            onSave(values);
            })
            .catch(info => {
            console.log('Validate Failed:', info);
            });
        }}
                
    >
        <Form
            form={form}
            layout="vertical"
            name="form_in_modal"
            initialValues={rowData}
            disabled={disabled}
        >
            <Form.Item
                name="campaignName"
                label="Campaign"
                rules={[
                    {
                      required: true,
                      message: 'Please input the campaign name',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="status"
                label="Status"
            >
                <Select
                    style={{
                    width: 120,
                    }}
                    options={[
                        {
                          value: 0,
                          label: 'OPEN',
                        },
                        {
                          value: 1,
                          label: 'HIDDEN',
                        },
                        {
                          value: 2,
                          label: 'CLOSED',
                        },
                        {
                          value: 3,
                          label: 'CANCELED',
                        },
                    ]}
                    >
                </Select>
            </Form.Item>
            <Form.Item
                name="salary"
                label="Salary"
                required='number'

            >
                <Input type="number"/>
            </Form.Item>
            <Form.Item
                name="location"
                label="Campaign Place"

            >
                <Select
                    style={{
                    width: 120,
                    }}
                    options={[
                        {
                          value: 0,
                          label: 'HCM',
                        },
                        {
                          value: 1,
                          label: 'HN',
                        },
                        {
                          value: 2,
                          label: 'ĐN',
                        },
                    ]}
                >
                </Select>
            </Form.Item>
            <Form.Item
                name="expirationDate"
                label="Expiration Date"
                >
                <Input type="date" />
                {/* <DatePicker /> */}
                    
            </Form.Item>
            {onDelete}
        </Form>
    </Modal>

)
}

export default EmeterForm