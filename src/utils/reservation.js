const { DateTime } = require("luxon");

function createDateTime(date, horario) {
  const [hours, minutes] = horario.split(':').map(x => parseInt(x));
  if (date instanceof Date)
    date = DateTime.fromJSDate(date);
  return date.set({ hours, minutes });
}

module.exports = {
  isReservationValid(reserva, reservas) {
    const chegada = reserva.chegada ?? createDateTime(reserva.dataChegada, reserva.horarioChegada);
    const saida = reserva.saida ?? createDateTime(reserva.dataSaida, reserva.horarioSaida);

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
  },
  validaData(data) {
    data = data.split("-");
    return new Date(
      `${data[0]}-${data[1].padStart(2, '0')}-${data[2].padStart(2, '0')}T01:00:00+01:00`
    );
  },
  validaHorario(horario) {
    function assert(cond) {
      if (!cond) {
        throw new Error("Assertion failed");
      }
    }
    assert(horario.split(':').length === 2);
    const [hour, minute] = horario.split(':').map(x => parseInt(x));
    assert(hour >= 0 && hour < 24);
    assert(minute >= 0 && minute < 60);
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  },
};