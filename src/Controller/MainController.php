<?php

namespace App\Controller;


use App\Service\IntraController;
use function PHPUnit\Framework\isObject;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Service\JwtService;
use Symfony\Component\Messenger\MessageBusInterface;


final class MainController extends AbstractController
{


    #[Route('/', name: 'app_main')]
    public function index(IntraController $intraController, JwtService $jwtService, MessageBusInterface $messageBus): Response
    {
        if ($this->getUser()) {
            //force to validate email
            if ($intraController->confirmEmail($this->getUser())) {
                if (isObject($this->getUser())) {
                $subject = 'Activation de votre compte';
                $destination = $intraController->setDestination('check_user');
                $nomTemplate = $intraController->setNomTemplate('register');
                $intraController->emailValidate($this->getUser(), $jwtService, $messageBus,$destination,$subject,$nomTemplate);
                    $this->addFlash('alert-warning', 'Vous devez activer votre adresse email ');
                    $this->redirectToRoute('app_logout');
                }
            }
        }
        return $this->render('main/index.html.twig', [
            'controller_name' => 'MainController',
        ]);
    }
}
