Rails.application.routes.draw do
  get 'dashboard/index'
  get 'dashboard/today'
  get 'dashboard/week'

  resources :tasks do
    resources :pomodori, only: [:new, :show, :create, :destroy]
  end
  root 'tasks#index'
end
