import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from "primereact/toast";

import axios from 'axios';

import { isPositiveInteger } from './helpers/helper';

export const MainTable = () => {
    const toast = useRef(null);

    const [products, setProducts] = useState([]);  //Здесь мы инициализируем стейт, используя пустой массив

    //Асинхронная функция для получения данных 
    const getProducts = async () => {
        const response = await axios.get('https://63f3d6b0864fb1d6001ebd3c.mockapi.io/api/testtable/v1/products');
        setProducts(response.data); //Здесь мы изменяем стейт, записывая в него массив, который получаем от сервера
    }

    //Асинхронная функция для изменения данных по id
    const updateProducts = async (data) => {
        const response = await axios.put(`https://63f3d6b0864fb1d6001ebd3c.mockapi.io/api/testtable/v1/products/${data.id}`, data); //Отправляем на сервер измененные данные о товаре 

        //Если запрос прошел успешно, выводим соответствующее сообщение, если нет, выводим сообщение с ошибкой
        if (response.status === 200) {
            toast.current.show({
                severity: "success",
                summary: "Успешно",
                detail: "Данные были изменены",
                life: 3000
            });
        } else {
            toast.current.show({
                severity: "error",
                summary: "Ошибка",
                detail: "Не удалось изменить данные",
                life: 3000
            });
        }

    }

    //При первом рендере автоматически вызывается функция, которая делает запрос к серверу для получения данных
    useEffect(() => {
        getProducts();
    }, []);

    const onCellEditComplete = (e) => {
        let { rowData, newValue, field, originalEvent: event } = e;

        if (rowData[field] === newValue) return;

        switch (field) {
            case 'price':
                if (isPositiveInteger(newValue)) rowData[field] = newValue; //Присваиваем значение, полученное от пользователя
                else event.preventDefault();
                break;

            default:
                if (newValue.trim().length > 0) rowData[field] = newValue; //Присваиваем значение, полученное от пользователя
                else event.preventDefault();
                break;
        }

        updateProducts(rowData); //Вызываем функцию, коорая отправит на сервер новые данные, которые ввел пользователь
    };

    const cellEditor = (options) => {
        if (options.field === 'price') return priceEditor(options);
        else return textEditor(options);
    };

    //Обработчик ввода текста
    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    };

    //Обработчик ввода цены
    const priceEditor = (options) => {
        return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} mode="currency" currency="USD" locale="en-US" />;
    };

    //Шаблон для отображения цены
    const priceBodyTemplate = (rowData) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(rowData.price);
    };

    return (
        <div className="card w-6 mx-auto mt-8">
            <h4 className='mb-5'>Тестовая таблица</h4>
            <Toast ref={toast} position="top-left" />
            <DataTable value={products} showGridlines editMode="cell">
                <Column field="name" header="Название" editor={(options) => cellEditor(options)} onCellEditComplete={onCellEditComplete} />
                <Column field="category" header="Категория товара" />
                <Column field="price" header="Цена" body={priceBodyTemplate} editor={(options) => cellEditor(options)} onCellEditComplete={onCellEditComplete} />
                <Column field="sales" header="Продажи" />
            </DataTable>
        </div>
    );
}