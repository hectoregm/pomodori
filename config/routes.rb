Rails.application.routes.draw do
  resources :tasks do
    resources :pomodori, only: [:new, :create]
  end
  root 'tasks#index'
end
