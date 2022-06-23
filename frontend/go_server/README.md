# Introduction

使用json為api的物件結構

HEADER 必須有 `Content-Type: application/json`

Status Code 200 為正常，其餘都失敗

# Command

### POST `/login`

* 登入

* body

| 參數     | 型別   | 必須 | 備註 |
|:---------|:-------|:-----|:-----|
| account  | string | 是   | 帳號 |
| password | string | 是   | 密碼 |


### POST `/signup`

* 註冊
* 只能本機(127.0.0.1)呼叫

* body

| 參數     | 型別   | 必須 | 備註 |
|:---------|:-------|:-----|:-----|
| account  | string | 是   | 帳號 |
| password | string | 是   | 密碼 |

### GET  `/api/tag`

* list TAG
* 沒有參數的話就是全部


| 參數 | 類別 | 必須 | 備註 |
| ---------- | ---- | -------- | ---- |
| id | int |  否  | TAG id |


### POST `/api/tag`

* 新增TAG


| 參數 | 類別 | 必須 | 備註 |
| ---------- | ---- | -------- | ---- |
| chinese_name | string |  是  | 中文TAG name |
| english_name | string |  是  | 英文TAG名稱 |


### PUT `/api/tag`

* 更新TAG


| 參數 | 類別 | 必須 | 備註 |
| ---------- | ---- | -------- | ---- |
| id | int |  是  | TAG id |
| chinese_name | string |  否  | 中文TAG name |
| english_name | string |  否  | 英文TAG名稱 |


### DELETE `/api/tag`

* 刪除tag

* body

| 參數 | 型別   | 必須 | 備註   |
|:-----|:-------|:-----|:-------|
| id   | number | 是   | tag id |

### GET `/api/item`

* 查詢商品

* body

* 給予id時回復object，其餘時間回復array


| 參數 | 類別 | 必須 | 備註 |
| ---------- | ---- | -------- | ---- |
| tag | int |  否  | 標籤ID |
|limit|number|否|需要幾筆（預設20）|
|offset|number|否|offset|

### POST `/api/item`

* 新增商品

* body


| 參數 | 類別 | 必須 | 備註 |
| ---------- | ---- | -------- | ---- |
| tag | int |  是  | 標籤ID |
| name | string |  是  | 商品名稱 |
| original | *string |  否  | 產地 |
| type | *string |  否  | 型號 |
| video | *string |  否  | 影片連結 |
| picture | *string |  否  | 商品主圖（base64字串） |
| images | []Pictures |  否  | 商品圖片陣列 |
| description | *string |  否  | 產品描述 |


### GET `/api/item_picture`

* 取得item照片

* body

| 參數    | 型別   | 必須 | 備註    |
|:--------|:-------|:-----|:--------|
| item_id | number | 是   | item id |

### PUT `/api/item`

* 更新商品

* body


| 參數 | 類別 | 必須 | 備註 |
| ---------- | ---- | -------- | ---- |
| item_id | int |  是  | 商品ID |
| tag | int |  否  | 標籤ID |
| name | string |  否  | 商品名稱 |
| original | *string |  否  | 產地 |
| type | *string |  否  | 型號 |
| video | *string |  否  | 影片連結 |
| picture | *string |  否  | 商品主圖（base64字串） |
| description | *string |  否  | 產品描述 |


### DELETE `/api/item`

* 刪除商品

* body

| 參數 | 型別   | 必須 | 備註    |
|:-----|:-------|:-----|:--------|
| id   | number | 是   | 商品 id |

### GET `/api/images`

* 取得圖片

* body


| 參數 | 類別 | 必須 | 備註 |
| ---------- | ---- | -------- | ---- |
| id | int |  否  | 圖片ID |


### POST `/api/images`

* 新增圖片

* body


| 參數 | 類別 | 必須 | 備註 |
| ---------- | ---- | -------- | ---- |
| item_id | int |  是  | 連結的商品ID |
| image | string |  是  | 圖片內容（使用Base64編碼） |


### PUT `/api/images`

* 更新圖片

* body


| 參數 | 類別 | 必須 | 備註 |
| ---------- | ---- | -------- | ---- |
| id | int |  是  | 圖片ID |
| image | string |  是  | 圖片內容（使用Base64編碼） |


### DELETE `/api/images`

* 刪除圖片

* body

| 參數 | 型別   | 必須 | 備註   |
|:-----|:-------|:-----|:-------|
| id   | number | 是   | 圖片id |