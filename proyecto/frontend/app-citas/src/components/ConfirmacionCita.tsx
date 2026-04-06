"use client";
import Link from "next/link";

export default function ConfirmacionCita({ onClose }: { onClose: () => void }) {
    return (
        <div className="fixed inset-0 bg-[#171717]/60 flex justify-center items-center z-[2000] ">
        <div className="bg-[#FDFBF2] rounded-xl p-8 max-w-[500px] w-[90%] text-center shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
            <div className="italic font-bold text-[20px] text-black mb-4">Logo</div>

            <div className="text-[48px] text-[#2E7D32] mb-4">✔</div>

            <h1 className="text-[32px] font-bold text-black mb-2">
            Su cita quedó agendada correctamente
            </h1>

            <p className="font-sans font-normal text-[16px] text-[#3B3B3B] mb-2">
            Le enviaremos un recordatorio a su correo 1 hora antes.
            </p>
            <p className="font-sans font-normal text-[16px] text-[#3B3B3B] mb-6">
            Recuerde ser puntual, no llegar a la cita podría afectar su reputación.
            </p>

            <div className="flex justify-between mt-8">
            <button className="bg-[#D32F2F] text-white font-semibold text-[16px] py-[0.6rem] px-[1.2rem] border-none rounded-lg cursor-pointer shadow-md transition-colors hover:bg-[#b71c1c]">Cancelar Cita</button>
            <Link href="/" className="inline-flex items-center justify-center bg-[#2D63ED] text-white font-semibold text-[16px] px-4 py-[0.6rem] rounded-lg shadow-md transition-all hover:bg-[#1f4ac0]">← Volver</Link>
            </div>
        </div>
        </div>
    );
}

// ESTE CODIGO ES PARA USARSE COMO PANTALLA EMERGENTE