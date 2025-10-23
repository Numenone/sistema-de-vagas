import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { EmpresaType } from '../utils/EmpresaType';

type Inputs = {
  titulo: string;
  descricao: string;
  requisitos: string;
  salario: number;
  empresaId?: number;
  modalidade: string;
  tipoContrato: string;
};

interface VagaFormProps {
  isSubmitting: boolean;
  empresas?: EmpresaType[]; // Opcional, apenas para admin
  isAdminForm?: boolean; // Opcional, para mostrar o seletor de empresa
}

export const VagaForm: React.FC<VagaFormProps> = ({ isSubmitting, empresas = [], isAdminForm = false }) => {
  const { register } = useFormContext<Inputs>();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="titulo" className="block mb-2 text-sm font-medium">Título da Vaga</label>
          <input type="text" id="titulo" className="form-input" required {...register("titulo")} disabled={isSubmitting} />
        </div>
        <div>
          <label htmlFor="salario" className="block mb-2 text-sm font-medium">Salário</label>
          <input type="number" id="salario" className="form-input" required {...register("salario")} disabled={isSubmitting} />
        </div>
      </div>
      <div>
        <label htmlFor="descricao" className="block mb-2 text-sm font-medium">Descrição</label>
        <textarea id="descricao" className="form-input" rows={4} required {...register("descricao")} disabled={isSubmitting} />
      </div>
      <div>
        <label htmlFor="requisitos" className="block mb-2 text-sm font-medium">Requisitos</label>
        <textarea id="requisitos" className="form-input" rows={3} required {...register("requisitos")} disabled={isSubmitting} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="modalidade" className="block mb-2 text-sm font-medium">Modalidade</label>
          <select id="modalidade" {...register('modalidade')} className="form-input" required disabled={isSubmitting}>
            <option value="Remoto">Remoto</option>
            <option value="Híbrido">Híbrido</option>
            <option value="Presencial">Presencial</option>
          </select>
        </div>
        <div>
          <label htmlFor="tipoContrato" className="block mb-2 text-sm font-medium">Tipo de Contrato</label>
          <select id="tipoContrato" {...register('tipoContrato')} className="form-input" required disabled={isSubmitting}>
            <option value="CLT">CLT</option>
            <option value="PJ">PJ</option>
          </select>
        </div>
      </div>
      {isAdminForm && (
        <div>
          <label htmlFor="empresaId" className="block mb-2 text-sm font-medium">Empresa</label>
          <select id="empresaId" {...register('empresaId')} className="form-input" required disabled={isSubmitting}>
            <option value="">Selecione a empresa</option>
            {empresas.map(empresa => (
              <option key={empresa.id} value={empresa.id}>{empresa.nome}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};