from abc import ABC, abstractmethod


class Token(ABC):
    @abstractmethod
    def create_token(self):
        pass

    @abstractmethod
    def verify_token(self):
        pass
