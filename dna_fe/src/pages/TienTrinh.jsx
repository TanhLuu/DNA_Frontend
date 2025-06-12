import React, { useEffect, useState } from 'react';

const steps = [
    "Đặt lịch đăng ký",
    "Chuyển kit lấy mẫu",
    "Thu thập mẫu",
    "Chuyển mẫu",
    "Xét nghiệm",
    "Trả kết quả",
];

function StepContent({ step, info }) {
    switch (step) {
        case 0:
            return <Step1 info={info} />;
        case 1:
            return <Step2 info={info} />;
        case 2:
            return <Step3 info={info} />;
        case 3:
            return <Step4 info={info} />;
        case 4:
            return <Step5 info={info} />;
        case 5:
            return <Step6 info={info} />;
        default:
            return null;
    }
}
function Step1({ info }) {
        return <div>Đặt lịch đăng ký: {info}</div>;
    }

    function Step2({ info }) {
        return <div>Chuyển kit lấy mẫu: {info}</div>;
    }

    function Step3({ info }) {
        return <div>Thu thập mẫu: {info}</div>;
    }

    function Step4({ info }) {
        return <div>Chuyển mẫu: {info}</div>;
    }

    function Step5({ info }) {
        return <div>Xét nghiệm: {info}</div>;
    }

    function Step6({ info }) {
        return <div>Trả kết quả: {info}</div>;
    }

    export default function TienTrinh(){}