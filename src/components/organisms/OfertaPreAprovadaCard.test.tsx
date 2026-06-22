import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import OfertaPreAprovadaCard from './OfertaPreAprovadaCard';
import { OfertaPreAprovada, ProdutoCredito } from '@/src/utils/creditoMockData';

describe('OfertaPreAprovadaCard', () => {
  const mockProduto: ProdutoCredito = {
    id: 'fno-car',
    sigla: 'FNO-CAR',
    nome: 'FNO Custeio Agropecuário',
    fonte: 'FNO',
    familia: 'Crédito Rural',
    referenciasMcr: 'MCR 2-1-1',
    codigoSiope: '5001',
    tefAnual: 7.0,
    spreadAnual: 2.0,
    tacPercent: 0.3,
    iofAnual: 0.38,
    cetEstimado: 9.68,
    prazoMaxMeses: 24,
    carenciaMaxMeses: 6,
    valorMinimo: 5000,
    valorMaximo: 3000000,
    portesAtendidos: 'Micro / Pequeno / Médio / Grande',
    finalidade: 'Financiamento de safra — insumos, mão de obra, serviços',
    sistemaAmortizacao: 'Price ou SAC',
    garantiasAceitas: 'Penhor agrícola, hipoteca, aval',
    exigeCar: true,
    exigeSicor: true,
    exigeZarc: true,
    exigeSensoriamento: false,
    documentosExigidos: 'DAP/CAF ou CNPJ, CAR, nota fiscal insumos, ZARC, croqui',
    observacoes: 'Principal linha de custeio da região Norte'
  };

  const mockOferta: OfertaPreAprovada = {
    id: 'pa-1',
    produtoId: 'fno-car',
    nomeProduto: 'FNO Custeio Agropecuário',
    valorPreAprovado: 450000,
    taxaEspecial: 8.5,
    prazoSugerido: 24,
    carenciaSugerida: 6,
    motivoOferta: 'Histórico de 5 safras financiadas com adimplência total',
    validadeOferta: new Date(),
    statusOferta: 'disponivel',
    gerenteNome: 'Ana Paula Santos',
    gerenteTelefone: '(91) 3004-9999'
  };

  it('renders correctly with given props', () => {
    const { getByText } = render(
      <OfertaPreAprovadaCard 
        oferta={mockOferta} 
        produto={mockProduto} 
        onSimular={() => {}} 
        onDetalhes={() => {}} 
      />
    );

    expect(getByText('FNO Custeio Agropecuário')).toBeTruthy();
    expect(getByText('Disponível')).toBeTruthy();
    expect(getByText('8.5% a.a.')).toBeTruthy();
    expect(getByText('24m prazo')).toBeTruthy();
    expect(getByText('6m carência')).toBeTruthy();
  });

  it('calls onSimular when the simulate button is pressed', () => {
    const handleSimular = jest.fn();
    const { getByText } = render(
      <OfertaPreAprovadaCard 
        oferta={mockOferta} 
        produto={mockProduto} 
        onSimular={handleSimular} 
        onDetalhes={() => {}} 
      />
    );

    fireEvent.press(getByText('Simular oferta'));
    expect(handleSimular).toHaveBeenCalledTimes(1);
  });
});
