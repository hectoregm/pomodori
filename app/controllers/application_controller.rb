class ApplicationController < ActionController::Base
  around_filter :time_zone
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def time_zone(&block)
    Time.use_zone("America/Mexico_City", &block)
  end
end
