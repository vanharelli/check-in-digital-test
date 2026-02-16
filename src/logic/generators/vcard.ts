export const generateWhatsAppPayload = (formData: any) => {
    const lines: string[] = [];

    lines.push('🏛 *CHECK-IN DIGITAL | AGÊNCIA MARKETELLI*');
    lines.push('🟢 *STATUS:* AGUARDANDO LIBERAÇÃO');
    lines.push('');
    lines.push('*IDENTIFICAÇÃO DO HÓSPEDE*');
    lines.push(`👤 *TITULAR:* ${formData.fullName.toUpperCase()}`);

    if (formData.isForeigner) {
        lines.push('🌍 *ESTRANGEIRO:* SIM');
        lines.push(`🏳 *PAÍS:* ${formData.passportCountry.toUpperCase()}`);
        lines.push(`🆔 *PASSAPORTE:* ${formData.passportId}`);
    } else {
        lines.push(`📑 *CPF:* ${formData.cpf}`);
        lines.push(`🎂 *NASCIMENTO:* ${formData.birthDate}`);
    }

    lines.push('');
    lines.push('*LOCALIZAÇÃO E CONTATO*');
    lines.push(`📍 *ENDEREÇO:* ${formData.address.toUpperCase()}, ${formData.number}`);
    lines.push(`🗺 *CIDADE:* ${formData.zipCode} - ${formData.city}/${formData.state}`);
    lines.push(`📱 *CONTATO:* ${formData.phone}`);
    lines.push(`📧 *E-MAIL:* ${formData.email.toLowerCase()}`);

    if (formData.roomNumber) {
        lines.push(`🔑 *QUARTO:* ${formData.roomNumber}`);
    }

    lines.push('');
    lines.push('*VAI USAR A GARAGEM?*');

    if (formData.hasVehicle) {
        lines.push(`🚗 *MODELO:* ${formData.vehicleModel.toUpperCase()} (${formData.vehicleColor.toUpperCase()})`);
        lines.push(`🆔 *PLACA:* ${formData.vehiclePlate.toUpperCase()}`);
        if (formData.vehicleExitTime) {
            lines.push(`⏱ *SAÍDA:* ${formData.vehicleExitTime}`);
        }
    } else {
        lines.push('🚫 NÃO VAI USAR!');
    }

    lines.push('');
    lines.push('---');
    lines.push('⚡ *SISTEMA OPERACIONAL MARKETELLI*');
    lines.push('🛡 *PROTOCOLO STATELESS | 14 ANOS DE EXPERIÊNCIA*');

    return lines.join('\n');
};
