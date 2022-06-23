import $ from "jquery";

var pad = "";
if (process.env.REACT_APP_BACKEND_URL[process.env.REACT_APP_BACKEND_URL.length - 1] !== "/") {
    pad = "/";
}

async function post(url, data, type = "POST") {
    if (url[0] === "/") {
        url = url.substr(1);
    }
    if (typeof data !== "string") {
        data = JSON.stringify(data);
    }
    try {
        return await $.ajax({
            url: process.env.REACT_APP_BACKEND_URL + pad + url,
            data: data,
            contentType: "application/json",
            dataType: "json",
            crossDomain: true,
            // xhrFields: { withCredentials: true },
            method: type
        });
    } catch (error) {
        console.log(error)
        console.log(pad + url)
        return checkLoginError(error);
        // checkLoginError(error);
        throw error;
    }
}



async function upload_post(url, formData, type = "POST") {
    if (url[0] === "/") {
        url = url.substr(1);
    }
    // if (typeof data !== "string") {
    //     data = JSON.stringify(data);
    // }
    try {
        // let formData = new FormData()
        // formData.append('file',data)
        return await $.ajax({
            url: process.env.REACT_APP_BACKEND_URL + pad + url,
            contentType: false, //required
            processData: false, // required
            // mimeType: 'multipart/form-data',
            data: formData,
            crossDomain: true,
            method: type
        });
    } catch (error) {
        console.log(error)
        console.log(pad + url)
        return checkLoginError(error);

    }
}

async function get(url, params = {}) {
    if (url[0] === "/") {
        url = url.substr(1);
    }
    try {
        let URL = new window.URL(process.env.REACT_APP_BACKEND_URL + pad + url);
        for (let param in params) {
            if (params[param] !== null && params[param] !== undefined) {
                URL.searchParams.set(param, params[param]);
            }
        }
        return await $.ajax({
            url: URL.href,
            crossDomain: true,
            // xhrFields: { withCredentials: true },
            mode: "cors",
            credentials: "include",
        });

    } catch (error) {
        console.log(error)
        console.log(pad + url)
        return checkLoginError(error);
        throw error;
    }
}

async function download_post(url, data, type = "POST", name) {
    if (url[0] === "/") {
        url = url.substr(1);
    }
    if (typeof data !== "string") {
        data = JSON.stringify(data);
    }

    // console.log(process.env.REACT_APP_BACKEND_URL + pad + url)
    data = await $.ajax({
        // type: "POST",
        url: process.env.REACT_APP_BACKEND_URL + pad + url,
        data: data,
        contentType: "application/json",
        // dataType: "json",
        xhrFields: { responseType: 'arraybuffer' },
        method: type,
    });

    console.log(data)
    var blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    //Check the Browser type and download the File.
    var isIE = false || !!document.documentMode;
    if (isIE) {
        window.navigator.msSaveBlob(data);
    } else {
        var url = window.URL || window.webkitURL;
        var link = url.createObjectURL(blob);
        console.log(link)
        var a = $("<a />");
        a.attr("download", `${name}.xlsx`);
        a.attr("href", link);
        $("body").append(a);
        a[0].click();
        $("body").remove(a);
    }




}

async function download(url, params = {}) {
    if (url[0] === "/") {
        url = url.substr(1);
    }
    try {
        let URL = new window.URL(process.env.REACT_APP_BACKEND_URL + pad + url);
        for (let param in params) {
            if (params[param] !== null && params[param] !== undefined) {
                URL.searchParams.set(param, params[param]);
            }
        }
        await $.ajax({
            url: URL.href,
            crossDomain: true,

            success: function (data) {
                window.location = URL.href

            }
        })

    } catch (error) {
        console.log(error)
        console.log(pad + url)

        // throw error;
    }
}

function checkLoginError(error) {
    let result = {
        "type": 2,
        "error": error
    }
    return result
}

export async function get_users() {
    return (await get(`/api/user/?format=json`))
}
export async function post_users(data) {
    return (await post(`/api/user/?format=json`,data))
}
export async function put_users(id,data) {
    return (await post(`/api/user/${id}/?format=json`,data,'put'))
}


export async function get_devices() {
    return (await get(`/api/devices/?format=json`))
}
export async function get_devices_by_id(id) {
    return (await get(`/api/devices/${id}/`))
}
export async function get_device_by_user(id) {
    return (await get(`/api/devices/get_device_by_user/?user=${id}`))
}


export async function put_devices(id, data) {
    return (await post(`/api/devices/${id}/?format=json`, data, 'put'))
}

export async function get_dispatch_by_id(id) {
    return (await get(`/api/dispatchlist/${id}/`))
}
export async function get_dispatch_by_dispatchNumber(dispatchNumber) {
    return (await get(`/api/dispatchlist/select_dispatch_by_dispatchNumber/?dispatchnumber=${dispatchNumber}`))
}

export async function get_all_devicedispatch() {
    return (await get(`/api/devicedispatch/`))
}

export async function select_dispatchdetail_by_dispatchNumber(dispatchNumber) {
    return (await get(`/api/dispatchlist/select_dispatchdetail_by_dispatchNumber/?dispatchnumber=${dispatchNumber}`))
}

export async function search_deviceDispatch_history(dispatchNumber) {
    return (await get(`/api/devicedispatch/search_deviceDispatch_history/?dispatchnumber=${dispatchNumber}`))
}
export async function search_DeviceDispatch_by_device(data) {
    return (await get(`/api/devicedispatch/search_DeviceDispatch_by_device/?user_id=${data.user_id}&today_start=${data.today_start}&today_end=${data.today_end}`))
}

export async function start_dispatch(data) {
    return (await post(`/api/dispatchlist/start_dispatch/`, data))
}
export async function complete_dispatch(data) {
    return (await post(`/api/dispatchlist/finish_dispatch/`, data))
}
export async function select_dispatchdetail_by_today(date) {
    return (await get(`/api/dispatchlist/select_dispatchdetail_by_today/?date=${date}`))
}


export async function get_last_device_count(device_id) {
    return (await get(`/api/devices/get_last_device_count/?id=${device_id}&format=json`))
}

export async function get_dispatch_device_count(dispatchnumber) {
    return (await get(`/api/devicecounts/select_device_by_dispatch/?dispatchnumber=${dispatchnumber}&format=json`))
}
export async function select_deviceCount_by_device(user_id) {
    return (await get(`/api/devicecounts/select_deviceCount_by_device/?user_id=${user_id}`))
}

export async function get_dispatch_by_status(status) {
    return (await get(`/api/dispatchlist/select_dispatch_by_status/?status=${status}`))
}


export async function uploadfile(file) {
    return (await upload_post(`/api/upload/upload/`, file))
}


export async function downloadfile(dispatchnumber) {
    return (await download(`/api/upload/dowload_filename/?dispatchnumber=${dispatchnumber}`))
}
export async function downloadexample() {
    return (await download(`/api/upload/download_example/`))
}

export async function downloadfile_post(json_data, name) {
    return (await download_post(`/api/dispatchlist/download_json/`, json_data, 'post',name))
}

export async function downloadfile_post_today(json_data, name) {
    // console.log(json_data)
    return (await download_post(`/api/dispatchlist/download_today_dispatch_json/`, json_data,'post', name))
}