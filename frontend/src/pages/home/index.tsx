import { notification } from 'antd';

const HomePage = () => {

  type NotificationType = 'success' | 'info' | 'warning' | 'error';
  // Функция для вывода уведомления
  const showNotification = (
    type: NotificationType,
    message: string,
    description?: string
  ) => {
    notification[type]({
      message,
      description,
      placement: 'topRight',
      duration: 3,
    });
  };

// Пример использования
  const handleClick = () => {
    showNotification('success', 'Успешно', 'Действие выполнено успешно');
  };

  return (
    <button onClick={handleClick}>
      Показать уведомление
    </button>
  );
}

export default HomePage