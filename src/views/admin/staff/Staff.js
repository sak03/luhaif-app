import React, { useEffect, useState, useCallback, useRef } from 'react'
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { useFormik } from "formik";
import './staff.css'
import axios from "axios";
import { ProgressSpinner } from "primereact/progressspinner";
import { InputSwitch } from 'primereact/inputswitch';
import { Toast } from 'primereact/toast';
import { TabView, TabPanel } from 'primereact/tabview';

const Staff = () => {
    const [viewMode, setViewMode] = useState(0);
    const [editMode, setEditMode] = useState(0);
    const [tenantLoading, setTenantLoading] = useState(false);
    const [showspinner, setshowspinner] = useState(false);
    const [tenantData1, settenantData1] = useState([]);
    const [selectedRowData, setSelectedRowData] = useState(null);
    const toast = useRef(null);

    useEffect(() => {
        getAllstaffs();
    }, [])

    const tenantFormik = useFormik({
        initialValues: {
            fname: "",
            lname: "",
            email: "",
        },
        validate: (data) => {
            let errors = {};

            // ===== row first =======
            if (!data.fname) {
                errors.fname = "Please enter first name.";
            }
            if (!data.lname) {
                errors.lname = "Please enter last name.";
            }
            if (!data.email) {
                errors.email = "Please enter email id.";
            }

            return errors;
        },
        onSubmit: (data) => {
            tenantFormik.resetForm();
            editMode === 2 ? updateAllstaffs(data) : ""
            console.log("formik Data", data)
        },
    });
    const isTenantFormFieldValid = (name) =>
        !!(tenantFormik.touched[name] && tenantFormik.errors[name]);
    const getTenantFormErrorMessage = (name) => {
        return (
            isTenantFormFieldValid(name) && (
                <small className="p-error">{tenantFormik.errors[name]}</small>
            )
        );
    };

    //==== show update message ======
    const showSuccessUpdate = (severity) => {
        toast.current.show({
            severity: 'success',
            summary: severity == 'success' ? 'Updated' : "Oops",
            detail: severity == 'success' ? 'User has been successfully updated' :"Something went wrong",
            life: 3000
        });
    }

    // get all staff data from API Server
    const getAllstaffs = async (data) => {
        setshowspinner(true);
        await axios
            .get(
                `https://reqres.in/api/users?page=1&per_page=50`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            .then(
                (res) => {
                    const dt = res.data.data;
                    // console.log("ndt1", dt);
                    settenantData1(dt);
                    setshowspinner(false);
                },
                (err) => {
                    console.log(err);
                    setshowspinner(false);
                }
            );
    };

    // get all staff data from API Server
    const updateAllstaffs = async (data) => {
        setshowspinner(true);
        const postData = {
            avatar: selectedRowData.avatar,
            email: data.email,
            first_name: data.fname,
            id: selectedRowData.id,
            last_name: data.lname
        }
        console.log("postData", postData);
        await axios
            .put(
                `https://reqres.in/api/users/${selectedRowData.id}`, postData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            .then(
                (res) => {
                    const dt = res.data.data;
                    getAllstaffs();
                    // console.log("ndt1", dt);
                    settenantData1(dt);
                    setshowspinner(false);
                    showSuccessUpdate("success");
                    setViewMode(0);
                },
                (err) => {
                    console.log(err);
                    setshowspinner(false);
                    showSuccessUpdate("error");
                }
            );
    };

    const addForm = () => {
        return (
            <form onSubmit={tenantFormik.handleSubmit}>
                <div className='mx-3 mt-3'>
                    <div className="row mx-3 mt-2">
                        <div className=" col-sm-12 col-md-6 col-lg-6 mt-4">
                            <span className="p-float-label">
                                <InputText
                                    id="fname"
                                    value={tenantFormik.values.fname}
                                    onChange={tenantFormik.handleChange}
                                    className={
                                        (classNames({
                                            "p-invalid": isTenantFormFieldValid("fname"),
                                        }),
                                            "p-inputtext-sm w-100 borderClass")
                                    }
                                />
                                <label htmlFor="fname">First name<span className='text-danger'>*</span></label>
                            </span>
                            {getTenantFormErrorMessage("fname")}
                        </div>
                        <div className=" col-sm-12 col-md-6 col-lg-6 mt-4">
                            <span className="p-float-label">
                                <InputText
                                    id="lname"
                                    value={tenantFormik.values.lname}
                                    onChange={tenantFormik.handleChange}
                                    className={
                                        (classNames({
                                            "p-invalid": isTenantFormFieldValid("lname"),
                                        }),
                                            "p-inputtext-sm w-100 borderClass")
                                    }
                                />
                                <label htmlFor="lname">Last name<span className='text-danger'>*</span></label>
                            </span>
                            {getTenantFormErrorMessage("lname")}
                        </div>
                        <div className=" col-sm-12 col-md-6 col-lg-6 mt-4">
                            <span className="p-float-label">
                                <InputText
                                    id="email"
                                    value={tenantFormik.values.email}
                                    onChange={tenantFormik.handleChange}
                                    className={
                                        (classNames({
                                            "p-invalid": isTenantFormFieldValid("email"),
                                        }),
                                            "p-inputtext-sm w-100 borderClass")
                                    }
                                />
                                <label htmlFor="email">Email Id<span className='text-danger'>*</span></label>
                            </span>
                            {getTenantFormErrorMessage("email")}
                        </div>
                    </div>
                    <div className="modal-footer d-flex justify-content-end my-3 mx-4">
                        <Button
                            label={editMode === 1 ? "Add" : "Update"}
                            type="submit"
                            className="bg-primary border-0  p-button-md  btn-color p-button-raised"
                        />
                        <Button
                            onClick={() => {
                                setViewMode(0);
                                tenantFormik.resetForm();
                            }}
                            label={"Cancel"}
                            style={{ marginLeft: "10px" }}
                            className="bg-danger border-0 p-button-md p-button-raised"
                        />
                    </div>
                </div>
            </form>
        )
    }

    // ==== row click handler =======
    const rowClickHandler = (rowdata) => {
        const dt = rowdata.data;
        // console.log(dt, "row data");
        setViewMode(1);
        setEditMode(2);
        setSelectedRowData(rowdata.data);
        tenantFormik.setFieldValue("fname", dt.first_name);
        tenantFormik.setFieldValue("lname", dt.last_name);
        tenantFormik.setFieldValue("email", dt.email);

    }


    const renderHeader1 = () => {
        return (
            <div className="row d-flex">
                <div className="col-lg-8">
                    <form
                    // onSubmit={searchFormik.handleSubmit}
                    >
                        <div className="row gap-lg-0 mt-lg-0">
                            <div className="col-sm-12 col-lg-4 mb-1">
                                <span className="p-input-icon-left w-100">
                                    <i className="pi pi-search" />
                                    <InputText
                                        // value={globalFilterValue1}
                                        // onChange={onGlobalFilterChange1}
                                        placeholder="Search name"
                                        className="p-inputtext-sm w-100"
                                        optionLabel="name"
                                        optionValue="name"
                                        filter={false}
                                    />
                                </span>
                            </div>
                        </div>
                    </form>
                </div>
                <div
                    className="col-sm-12 col-md-12 col-lg-4 d-flex "
                    style={{ justifyContent: "right" }}
                >
                    <Button
                        label="Add"
                        className="p-button-outlined p-button-primary p-button-md"
                        onClick={() => {
                            setEditMode(1);
                            setViewMode(1);
                        }}
                    />
                    <Button
                        style={{
                            marginLeft: "10px",
                        }}
                        role="button"
                        icon="pi pi-filter-slash"
                        label="Clear"
                        className="p-button-outlined p-button-md"
                    />
                </div>
            </div>
        );
    };
    const header1 = renderHeader1();

    return (
        <div className="row mb-2">
            <Toast ref={toast} />
            <TabView>
                <TabPanel header="Teaching Staff">
                    <div className="col-sm-12 rounded">
                        <div className="">
                            {viewMode === 1 ? (addForm()) : (
                                <DataTable
                                    value={tenantData1}
                                    responsiveLayout="scroll"
                                    className="p-datatable-customers"
                                    showGridlines={false}
                                    rows={10}
                                    // stripedRows
                                    dataKey="id"
                                    paginator
                                    // filters={filters1}
                                    loading={tenantLoading}
                                    filterDisplay="menu"
                                    globalFilterFields={[
                                        "email",
                                        "user",
                                        "role",
                                        "city",
                                        "updatedDate",
                                        "status",
                                    ]}
                                    header={header1}
                                    onRowClick={rowClickHandler}
                                    emptyMessage="No tenants found."
                                >
                                    {/* <Column field="sNo" header="S. No." style={{ cursor: "pointer" }} sortable></Column> */}
                                    <Column
                                        header="First Name"
                                        field="first_name"
                                        // body={(rowdata) => rowdata.firstName + " " + rowdata.lastName}
                                        style={{ cursor: "pointer" }}
                                        sortable
                                    ></Column>
                                    <Column
                                        field="last_name"
                                        header="Last Name"
                                        style={{ cursor: "pointer" }}
                                        sortable
                                    ></Column>
                                    {/* <Column
                                        field="city"
                                        header="Location"
                                        body={(rd) => {
                                            let city = rd.address.city.charAt(0).toUpperCase() + rd.address.city.slice(1);
                                            return (
                                                <span>{city + ", " + rd.address.state.toUpperCase()}</span>
                                            )
                                        }}
                                        style={{ cursor: "pointer" }}
                                        sortable
                                    ></Column> */}
                                    <Column
                                        header="email"
                                        field="email"
                                        style={{ cursor: "pointer" }}
                                        sortable
                                    ></Column>
                                    {/* <Column
                                        field="phone"
                                        header="Phone"
                                        style={{ cursor: "pointer" }}
                                        sortable
                                    ></Column>
                                    <Column
                                        field="username"
                                        header="Username"
                                        style={{ cursor: "pointer" }}
                                        sortable
                                    ></Column>
                                    <Column
                                        field="gender"
                                        header="gender"
                                        style={{ cursor: "pointer" }}
                                        sortable
                                    ></Column> */}
                                </DataTable>)}
                        </div>
                    </div>
                </TabPanel>
            </TabView>
            {showspinner && (
                <div className="spinner-div">
                    <ProgressSpinner />
                </div>
            )}
        </div>
    )
}

export default Staff