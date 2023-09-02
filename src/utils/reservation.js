const { DateTime } = require("luxon");

function createDateTime(date, horario) {
  const [hours, minutes] = horario.split(':').map(x => parseInt(x));
  if (date instanceof Date)
    date = DateTime.fromJSDate(date);
  return date.set({ hours, minutes });
}

module.exports = {
  isReservationValid(reserva, reservas) {
    const chegada = createDateTime(reserva.dataChegada, reserva.horarioChegada);
    const saida = createDateTime(reserva.dataSaida, reserva.horarioSaida);

    for (let otherReserva of reservas) {
      const otherChegada = createDateTime(otherReserva.dataChegada, otherReserva.horarioChegada);
      const otherSaida = createDateTime(otherReserva.dataSaida, otherReserva.horarioSaida);
      if (chegada > otherChegada) {
        // essa reserva inicia apos a outra,
        // então é invalida se essa inicia antes da outra acabar
        if (chegada < otherSaida) {
          return false;
        }
      } else {
        // essa reserva inicia antes da outra,
        // então é invalida se acaba depois da outra iniciar
        if (saida > otherChegada) {
          return false;
        }
      }
    }

    return true;
  }
};