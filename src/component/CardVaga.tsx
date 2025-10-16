import { Link } from "react-router-dom";
import type { VagaType } from "../utils/VagaType";
import React from 'react';

export function CardVaga({ data }: { data: VagaType }) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
            <div className="flex justify-center items-center h-48 bg-gray-100 rounded-t-lg p-4">
                <img 
                    className="h-32 w-auto object-contain max-w-full" 
                    src={data.empresa.logo} 
                    alt={`Logo da ${data.empresa.nome}`} 
                    onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMTIwIDYwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iNjAiIGZpbGw9IiNlNWU3ZWIiLz48dGV4dCB4PSI2MCIgeT0iMzAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzY3Njg2QSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+TG9nbyBOw6NvIERpc3BvbsOtdmVsPC90ZXh0Pjwvc3ZnPg==";
                    }}
                />
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 line-clamp-2 min-h-[56px]">
                    {data.titulo}
                </h5>
                
                <div className="mb-3">
                    <span className="font-semibold text-gray-700">{data.empresa.nome}</span>
                </div>
                
                <div className="mb-4 space-y-2">
                    <div className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.093a3.535 3.535 0 00-1.676.662A1 1 0 006 7v2a1 1 0 00.324.738 3.536 3.536 0 001.676.662v1.941a1 1 0 10 2 0v-1.941a3.536 3.536 0 001.676-.662A1 1 0 0014 9V7a1 1 0 00-.324-.738 3.535 3.535 0 00-1.676-.662V5z" clipRule="evenodd"/>
                        </svg>
                        <span>R$ {Number(data.salario).toLocaleString("pt-br", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                        </svg>
                        <span>Remoto/Híbrido</span>
                    </div>
                </div>
                
                <div className="mt-auto">
                    <Link 
                        to={`/detalhes/${data.id}`} 
                        className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 transition-colors duration-200"
                    >
                        Ver Detalhes
                        <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}