Rails.application.routes.draw do
  resources :tasks do
    resources :pomodori, only: [:new, :show, :create, :destroy]
  end
  root 'tasks#index'
end
