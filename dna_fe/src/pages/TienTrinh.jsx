import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import FormStep1 from "../components/FormStep1";
import FormStep2 from "../components/FormStep2";
import FormStep2HanhChinh from "../components/FormStep2HanhChinh";
import FormStep3 from "../components/FormStep3";
import FormStep3HanhChinh from "../components/FormStep3HanhChinh";
import FormStep4 from "../components/FormStep4";
import FormStep5 from "../components/FormStep5";
import FormStep6 from "../components/FormStep6";

export default function ProcessTracker() {
  const { maHoSo } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [loaiHoSo, setLoaiHoSo] = useState("");
  const [completedSteps, setCompletedSteps] = useState({
    step1: false,
    step2: false,
    step3: false,
    step4: false,
    step5: false,
    step6: false
  });
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Lấy thông tin role từ localStorage hoặc context
    const role = localStorage.getItem("userRole") || "customer";
    setUserRole(role);

    // Có thể lấy thông tin bước hiện tại từ localStorage nếu cần
    const savedStep = localStorage.getItem(`currentStep_${maHoSo}`);
    if (savedStep) {
      setCurrentStep(parseInt(savedStep));
    }

    // Có thể lấy thông tin các bước đã hoàn thành từ localStorage
    const savedCompletedSteps = localStorage.getItem(`completedSteps_${maHoSo}`);
    if (savedCompletedSteps) {
      setCompletedSteps(JSON.parse(savedCompletedSteps));
    }
    const loai = localStorage.getItem(`loaiHoSo_${maHoSo}`) || "dan_su"; // default là dân sự
    setLoaiHoSo(loai);
  }, [maHoSo]);

  // Hàm này được gọi khi một bước hoàn thành
  const handleStepComplete = (step) => {
    const newCompletedSteps = { ...completedSteps, [`step${step}`]: true };
    setCompletedSteps(newCompletedSteps);

    // Lưu trạng thái vào localStorage nếu cần
    localStorage.setItem(`completedSteps_${maHoSo}`, JSON.stringify(newCompletedSteps));

    // Nếu là bước cuối cùng, không chuyển tiếp
    if (step < 6) {
      setCurrentStep(step + 1);
      localStorage.setItem(`currentStep_${maHoSo}`, step + 1);
    }
  };

  const handleStepClick = (step) => {
    // Staff có thể xem tất cả các bước
    if (userRole === "staff") {
      setCurrentStep(step);
      return;
    }

    // Customer chỉ có thể xem các bước đã hoàn thành hoặc bước hiện tại
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <FormStep1
          maHoSo={maHoSo}
          onComplete={() => handleStepComplete(1)}
          isStaff={userRole === "staff"}
          isCompleted={completedSteps.step1}
        />;
      case 2:
        if (loaiHoSo === "hanh_chinh") {
          return (
            <FormStep2HanhChinh
              maHoSo={maHoSo}
              onComplete={() => handleStepComplete(2)}
              isStaff={userRole === "staff"}
              isCompleted={completedSteps.step2}
            />
          );
        } else {
          return (
            <FormStep2
              maHoSo={maHoSo}
              onComplete={() => handleStepComplete(2)}
              isStaff={userRole === "staff"}
              isCompleted={completedSteps.step2}
            />
          );
        }
      case 3:
        if (loaiHoSo === "hanh_chinh") {
          return <FormStep3HanhChinh
            maHoSo={maHoSo}
            onComplete={() => handleStepComplete(3)}
            isStaff={userRole === "staff"}
            isCompleted={completedSteps.step3}
          />;
        }
        return <FormStep3
          maHoSo={maHoSo}
          onComplete={() => handleStepComplete(3)}
          isStaff={userRole === "staff"}
          isCompleted={completedSteps.step3}
        />;
      case 4:
        return <FormStep4
          maHoSo={maHoSo}
          onComplete={() => handleStepComplete(4)}
          isStaff={userRole === "staff"}
          isCompleted={completedSteps.step4}
        />;
      case 5:
        return <FormStep5
          maHoSo={maHoSo}
          onComplete={() => handleStepComplete(5)}
          isStaff={userRole === "staff"}
          isCompleted={completedSteps.step5}
        />;
      case 6:
        return <FormStep6
          maHoSo={maHoSo}
          onComplete={() => handleStepComplete(6)}
          isStaff={userRole === "staff"}
          isCompleted={completedSteps.step6}
        />;
      default:
        return;
    }
  };

  return (
    <div className="process-tracker">
      <h2>Tiến Trình Xét Nghiệm: {maHoSo}</h2>

      <div className="process-steps">
        {[1, 2, 3, 4, 5, 6].map((step) => (
          <div
            key={step}
            className={`step ${currentStep === step ? 'active' : ''} 
                        ${completedSteps[`step${step}`] ? 'completed' : ''}`}
            onClick={() => handleStepClick(step)}
          >
            <div className="step-number">{step}</div>
            <div className="step-name">{getStepName(step)}</div>
          </div>
        ))}
      </div>

      <div className="step-content">
        {renderStepContent()}
      </div>
    </div>
  );
}

// Hàm phụ trợ để lấy tên của từng bước
function getStepName(step) {
  switch (step) {
    case 1: return "Đăng ký";
    case 2: return "Chuẩn bị lấy mẫu";
    case 3: return "Thu Thập mẫu";
    case 4: return "Chuyển mẫu";
    case 5: return "Xét nghiệm";
    case 6: return "Trả kết quả";
    default: return;
  }
}